'use client';

/**
 * Cooperative Task Scheduling & Yielding Utilities.
 *
 * Platform Reference: Modern Web Guidance (MWG: schedule-tasks-by-priority, Web Features: Scheduler API)
 *
 * Provides cooperative yielding to keep the browser main thread and compositor responsive
 * (<50ms Interaction to Next Paint / INP) during heavy data table sorting, large medical record
 * filtering, and client-side processing tasks.
 */
import * as React from 'react';

export type TaskPriority = 'user-blocking' | 'user-visible' | 'background';

export interface TaskPriorityOptions {
  priority?: TaskPriority;
  signal?: AbortSignal;
  delay?: number;
}

export interface W3CScheduler {
  yield?(): Promise<void>;
  postTask?<T>(callback: () => T | Promise<T>, options?: TaskPriorityOptions): Promise<T>;
}

/**
 * Cooperatively yields control back to the main thread event loop so that
 * pending user interactions (clicks, keystrokes) and browser paints execute immediately.
 * Uses native `scheduler.yield()` if available, falling back to a macro-task timeout.
 */
export async function yieldToMain(): Promise<void> {
  if (typeof window !== 'undefined' && typeof window.scheduler?.yield === 'function') {
    try {
      await window.scheduler.yield();
      return;
    } catch {
      // Fall through to fallback on exception
    }
  }

  return new Promise<void>((resolve) => {
    if (typeof setTimeout !== 'undefined') {
      setTimeout(resolve, 0);
    } else {
      resolve();
    }
  });
}

/**
 * Schedules a unit of work with a specified priority level using the W3C Prioritized Task Scheduling API.
 */
export async function postTask<T>(
  callback: () => T | Promise<T>,
  options: TaskPriorityOptions = {}
): Promise<T> {
  if (typeof window !== 'undefined' && typeof window.scheduler?.postTask === 'function') {
    return window.scheduler.postTask(callback, options) as Promise<T>;
  }

  const { signal, delay = 0 } = options;
  if (signal?.aborted) {
    return Promise.reject(signal.reason ?? new DOMException('Task aborted', 'AbortError'));
  }

  return new Promise<T>((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const onAbort = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      reject(signal?.reason ?? new DOMException('Task aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    timeoutId = setTimeout(
      () => {
        signal?.removeEventListener('abort', onAbort);
        Promise.resolve().then(callback).then(resolve, reject);
      },
      delay > 0 ? delay : 0
    );
  });
}

export interface ProcessChunkedOptions {
  /** Frame budget in milliseconds before yielding to the main thread. Defaults to 8ms. */
  budgetMs?: number;
  /** Optional AbortSignal to cancel chunked processing early. */
  signal?: AbortSignal;
}

export interface YieldingFilterOptions {
  /** Frame budget in milliseconds before yielding to the main thread. Defaults to 8ms. */
  budgetMs?: number;
  /** Reactive dependency list that triggers re-filtering without restarting on inline predicate recreation. */
  deps?: React.DependencyList;
}

interface NavigatorScheduling {
  isInputPending?(options?: { includeContinuous?: boolean }): boolean;
}

const DEFAULT_FRAME_BUDGET_MS = 8;

function getNow(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function shouldYield(sliceStart: number, budgetMs: number): boolean {
  if (typeof navigator !== 'undefined') {
    const scheduling = (navigator as Navigator & { scheduling?: NavigatorScheduling }).scheduling;
    if (typeof scheduling?.isInputPending === 'function' && scheduling.isInputPending()) {
      return true;
    }
  }
  return getNow() - sliceStart >= budgetMs;
}

/**
 * Iterates through a large array using a frame-friendly time deadline (default 8ms)
 * and `navigator.scheduling?.isInputPending()` checks to maintain 60fps responsiveness.
 */
export async function processChunked<T, R>(
  items: T[],
  processFn: (item: T, index: number) => R,
  chunkSizeOrOptions?: number | ProcessChunkedOptions
): Promise<R[]> {
  const options: ProcessChunkedOptions =
    typeof chunkSizeOrOptions === 'object' && chunkSizeOrOptions !== null
      ? chunkSizeOrOptions
      : {};
  const budgetMs = options.budgetMs ?? DEFAULT_FRAME_BUDGET_MS;
  const { signal } = options;

  const results: R[] = [];
  let sliceStart = getNow();

  for (let i = 0; i < items.length; i++) {
    if (signal?.aborted) {
      throw signal.reason ?? new DOMException('Task aborted', 'AbortError');
    }
    results.push(processFn(items[i], i));
    if (i < items.length - 1 && shouldYield(sliceStart, budgetMs)) {
      await yieldToMain();
      sliceStart = getNow();
    }
  }

  return results;
}

/**
 * React hook that asynchronously filters large collections without locking the main thread.
 * Uses an 8ms frame-friendly deadline and `isInputPending()` checks. Pass reactive `deps`
 * (either via options `{ deps }` or the 4th parameter) so filtering re-runs when query state
 * changes without restarting on inline predicate arrow re-creation.
 */
export function useYieldingFilter<T>(
  items: T[],
  predicate: (item: T) => boolean,
  chunkSizeOrOptions?: number | YieldingFilterOptions,
  deps?: React.DependencyList
) {
  const budgetMs =
    typeof chunkSizeOrOptions === 'object' && chunkSizeOrOptions !== null
      ? (chunkSizeOrOptions.budgetMs ?? DEFAULT_FRAME_BUDGET_MS)
      : DEFAULT_FRAME_BUDGET_MS;
  const resolvedDeps =
    typeof chunkSizeOrOptions === 'object' && chunkSizeOrOptions !== null
      ? (chunkSizeOrOptions.deps ?? deps)
      : deps;

  const [filtered, setFiltered] = React.useState<T[]>(items);
  const [isFiltering, setIsFiltering] = React.useState(false);
  const predicateRef = React.useRef(predicate);
  const prevDepsRef = React.useRef<React.DependencyList | undefined>(undefined);
  const prevItemsRef = React.useRef<T[] | undefined>(undefined);
  const prevBudgetRef = React.useRef<number | undefined>(undefined);
  const runIdRef = React.useRef(0);

  React.useEffect(() => {
    predicateRef.current = predicate;
  }, [predicate]);

  React.useEffect(() => {
    const itemsChanged = !Object.is(prevItemsRef.current, items);
    const budgetChanged = !Object.is(prevBudgetRef.current, budgetMs);
    let depsChanged = false;

    if (resolvedDeps !== undefined) {
      const prev = prevDepsRef.current;
      depsChanged =
        !prev ||
        prev.length !== resolvedDeps.length ||
        resolvedDeps.some((value, index) => !Object.is(value, prev[index]));
    }

    if (!itemsChanged && !budgetChanged && !depsChanged) {
      return;
    }

    prevItemsRef.current = items;
    prevBudgetRef.current = budgetMs;
    prevDepsRef.current = resolvedDeps;

    const currentRunId = ++runIdRef.current;
    let active = true;
    setIsFiltering(true);

    async function runFilter() {
      const matched: T[] = [];
      let sliceStart = getNow();

      for (let i = 0; i < items.length; i++) {
        if (!active || runIdRef.current !== currentRunId) return;
        if (predicateRef.current(items[i])) {
          matched.push(items[i]);
        }
        if (i < items.length - 1 && shouldYield(sliceStart, budgetMs)) {
          await yieldToMain();
          sliceStart = getNow();
        }
      }
      if (active && runIdRef.current === currentRunId) {
        setFiltered(matched);
        setIsFiltering(false);
      }
    }

    runFilter().catch(() => {
      if (active && runIdRef.current === currentRunId) {
        setIsFiltering(false);
      }
    });

    return () => {
      active = false;
    };
  }, [items, budgetMs, resolvedDeps]);

  return { filtered, isFiltering };
}

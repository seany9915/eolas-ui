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

declare global {
  interface Window {
    scheduler?: W3CScheduler;
  }
}

/**
 * Cooperatively yields control back to the main thread event loop so that
 * pending user interactions (clicks, keystrokes) and browser paints execute immediately.
 * Uses native `scheduler.yield()` if available, falling back to a macro-task timeout.
 */
export async function yieldToMain(): Promise<void> {
  if (typeof window !== 'undefined' && window.scheduler?.yield) {
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
  if (typeof window !== 'undefined' && window.scheduler?.postTask) {
    return window.scheduler.postTask(callback, options);
  }

  if (options.delay && options.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, options.delay));
  }

  return callback();
}

/**
 * Iterates through a large array in chunks, cooperatively yielding to the main thread
 * after every `chunkSize` items to maintain 60fps responsiveness.
 */
export async function processChunked<T, R>(
  items: T[],
  processFn: (item: T, index: number) => R,
  chunkSize = 50
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i++) {
    results.push(processFn(items[i], i));
    if (i > 0 && i % chunkSize === 0) {
      await yieldToMain();
    }
  }
  return results;
}

/**
 * React hook that asynchronously filters large collections without locking the main thread.
 */
export function useYieldingFilter<T>(
  items: T[],
  predicate: (item: T) => boolean,
  chunkSize = 100
) {
  const [filtered, setFiltered] = React.useState<T[]>(items);
  const [isFiltering, setIsFiltering] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    setIsFiltering(true);

    async function runFilter() {
      const matched: T[] = [];
      for (let i = 0; i < items.length; i++) {
        if (!active) return;
        if (predicate(items[i])) {
          matched.push(items[i]);
        }
        if (i > 0 && i % chunkSize === 0) {
          await yieldToMain();
        }
      }
      if (active) {
        setFiltered(matched);
        setIsFiltering(false);
      }
    }

    runFilter().catch(() => {
      if (active) setIsFiltering(false);
    });

    return () => {
      active = false;
    };
  }, [items, predicate, chunkSize]);

  return { filtered, isFiltering };
}

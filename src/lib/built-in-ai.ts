'use client';

/**
 * On-device Built-in AI Hooks (Prompt API, Language Detector, Summarizer & Translator).
 *
 * Platform Reference: Modern Web Guidance (MWG: language-model, language-detection, summarizer, translator)
 *
 * Provides strongly-typed React hooks leveraging Chrome & Edge on-device
 * Gemini Nano / Phi models (Chrome 138+) with graceful fallback strategies.
 */
import * as React from 'react';

export type BuiltInAiAvailability = 'available' | 'downloadable' | 'downloading' | 'unavailable';

export type SummarizerType = 'key-points' | 'tldr' | 'teaser' | 'headline';
export type SummarizerFormat = 'markdown' | 'plain-text';
export type SummarizerLength = 'short' | 'medium' | 'long';

export interface SummarizerOptions {
  type?: SummarizerType;
  format?: SummarizerFormat;
  length?: SummarizerLength;
  sharedContext?: string;
  expectedInputLanguages?: string[];
  outputLanguage?: string;
}

export interface SummarizeContextOptions {
  context?: string;
  signal?: AbortSignal;
}

export interface TranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
  signal?: AbortSignal;
}

export interface TranslateCallOptions {
  signal?: AbortSignal;
}

export interface DetectCallOptions {
  signal?: AbortSignal;
}

export interface LanguageModelPromptOptions {
  responseConstraint?: unknown;
  omitResponseConstraintInput?: boolean;
  signal?: AbortSignal;
}

export interface LanguageModelExpectedIO {
  type: 'text' | 'image' | 'audio';
  languages?: string[];
}

export interface LanguageModelInitialPrompt {
  role: 'system' | 'user' | 'assistant';
  content: string;
  prefix?: boolean;
}

export interface LanguageModelOptions {
  /** Legacy alias mapped into an initial `{ role: 'system', content }` prompt for Chrome 138+ compatibility. */
  systemPrompt?: string;
  initialPrompts?: LanguageModelInitialPrompt[];
  expectedInputs?: LanguageModelExpectedIO[];
  expectedOutputs?: Array<{ type: 'text'; languages?: string[] }>;
  temperature?: number;
  topK?: number;
  signal?: AbortSignal;
}

export interface DetectedLanguageResult {
  detectedLanguage: string;
  confidence: number;
}

// Global W3C / Chrome 138+ Built-in AI interfaces
interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

interface ModelMonitor {
  addEventListener(
    type: 'downloadprogress',
    listener: (event: DownloadProgressEvent) => void
  ): void;
}

interface SummarizerInstance {
  summarize(text: string, options?: SummarizeContextOptions): Promise<string>;
  summarizeStreaming(text: string, options?: SummarizeContextOptions): AsyncIterable<string>;
  destroy?(): void;
}

interface SummarizerFactory {
  availability(options?: SummarizerOptions): Promise<BuiltInAiAvailability>;
  create(options?: SummarizerOptions & { monitor?: (m: ModelMonitor) => void; signal?: AbortSignal }): Promise<SummarizerInstance>;
}

interface TranslatorInstance {
  translate(text: string, options?: TranslateCallOptions): Promise<string>;
  translateStreaming(text: string, options?: TranslateCallOptions): AsyncIterable<string>;
  destroy?(): void;
}

interface TranslatorFactory {
  availability(options: TranslatorOptions): Promise<BuiltInAiAvailability>;
  create(options: TranslatorOptions & { monitor?: (m: ModelMonitor) => void }): Promise<TranslatorInstance>;
}

interface LanguageModelInstance {
  readonly inputUsage?: number;
  readonly inputQuota?: number;
  prompt(input: string, options?: LanguageModelPromptOptions): Promise<string>;
  promptStreaming(input: string, options?: LanguageModelPromptOptions): AsyncIterable<string>;
  measureInputUsage?(input: string, options?: { signal?: AbortSignal }): Promise<number>;
  clone?(options?: { signal?: AbortSignal }): Promise<LanguageModelInstance>;
  destroy?(): void;
}

type ChromeLanguageModelCreateOptions = Omit<LanguageModelOptions, 'systemPrompt'>;

interface LanguageModelFactory {
  availability(options?: ChromeLanguageModelCreateOptions): Promise<BuiltInAiAvailability>;
  create(
    options?: ChromeLanguageModelCreateOptions & { monitor?: (m: ModelMonitor) => void }
  ): Promise<LanguageModelInstance>;
}

interface LanguageDetectorInstance {
  detect(text: string, options?: DetectCallOptions): Promise<DetectedLanguageResult[]>;
  destroy?(): void;
}

interface LanguageDetectorFactory {
  availability(): Promise<BuiltInAiAvailability>;
  create(options?: { monitor?: (m: ModelMonitor) => void; signal?: AbortSignal }): Promise<LanguageDetectorInstance>;
}

declare global {
  interface Window {
    Summarizer?: SummarizerFactory;
    Translator?: TranslatorFactory;
    LanguageModel?: LanguageModelFactory;
    LanguageDetector?: LanguageDetectorFactory;
  }
}

function normalizeLanguageModelOptions(
  options?: LanguageModelOptions
): ChromeLanguageModelCreateOptions | undefined {
  if (!options) return undefined;
  const { systemPrompt, initialPrompts, ...rest } = options;
  if (!systemPrompt) {
    return initialPrompts ? { ...rest, initialPrompts } : rest;
  }
  const hasSystemPrompt = initialPrompts?.some((entry) => entry.role === 'system');
  const mergedInitialPrompts: LanguageModelInitialPrompt[] = hasSystemPrompt
    ? [...(initialPrompts ?? [])]
    : [{ role: 'system', content: systemPrompt }, ...(initialPrompts ?? [])];
  return {
    ...rest,
    initialPrompts: mergedInitialPrompts,
  };
}

function serializeAiOptions(options: unknown): string {
  if (!options) return '';
  try {
    return JSON.stringify(options, (key, value) => (key === 'signal' ? undefined : value));
  } catch {
    return '';
  }
}

function isTranslatorOptions(value: unknown): value is TranslatorOptions {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sourceLanguage' in value &&
    'targetLanguage' in value
  );
}

interface DestroyableInstance {
  destroy?(): void;
}

interface BuiltInAiFactory<TInstance extends DestroyableInstance, TOptions> {
  availability(options?: TOptions): Promise<BuiltInAiAvailability>;
  create(options?: TOptions & { monitor?: (m: ModelMonitor) => void }): Promise<TInstance>;
}

function useBuiltInAiSession<TInstance extends DestroyableInstance, TOptions extends object>(
  factory: BuiltInAiFactory<TInstance, TOptions> | undefined,
  unsupportedMessage: string,
  defaultOptions?: TOptions,
  optionsRequired = false,
  missingOptionsMessage?: string
) {
  const [availability, setAvailability] = React.useState<BuiltInAiAvailability>('unavailable');
  const [downloadProgress, setDownloadProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const instanceRef = React.useRef<TInstance | null>(null);
  const activeOptionsKeyRef = React.useRef<string>('');
  const pendingRef = React.useRef<{ key: string; promise: Promise<TInstance> } | null>(null);
  const generationRef = React.useRef(0);
  const mountedRef = React.useRef(true);

  const defaultOptionsKey = serializeAiOptions(defaultOptions);
  const defaultOptionsRef = React.useRef(defaultOptions);
  React.useEffect(() => {
    defaultOptionsRef.current = defaultOptions;
  }, [defaultOptions]);

  React.useEffect(() => {
    mountedRef.current = true;
    generationRef.current += 1;

    if (!factory || (optionsRequired && !defaultOptionsRef.current)) {
      setAvailability('unavailable');
      return () => {
        mountedRef.current = false;
        generationRef.current += 1;
        instanceRef.current?.destroy?.();
        instanceRef.current = null;
        activeOptionsKeyRef.current = '';
        pendingRef.current = null;
      };
    }

    let active = true;
    factory
      .availability(defaultOptionsRef.current)
      .then((status) => {
        if (active && mountedRef.current) setAvailability(status);
      })
      .catch((err: unknown) => {
        if (active && mountedRef.current) {
          setAvailability('unavailable');
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      active = false;
      mountedRef.current = false;
      generationRef.current += 1;
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
      activeOptionsKeyRef.current = '';
      pendingRef.current = null;
    };
  }, [factory, defaultOptionsKey, optionsRequired]);

  const getOrCreateInstance = React.useCallback(
    async (overrideOptions?: TOptions): Promise<TInstance> => {
      if (!factory) {
        throw new Error(unsupportedMessage);
      }

      const base = defaultOptionsRef.current;
      const mergedOptions =
        base && overrideOptions
          ? ({ ...base, ...overrideOptions } as TOptions)
          : (overrideOptions ?? base);

      if (optionsRequired && !mergedOptions) {
        throw new Error(missingOptionsMessage ?? unsupportedMessage);
      }

      const targetKey = serializeAiOptions(mergedOptions);
      if (instanceRef.current && activeOptionsKeyRef.current === targetKey) {
        return instanceRef.current;
      }

      if (pendingRef.current && pendingRef.current.key === targetKey) {
        return pendingRef.current.promise;
      }

      // Gate user activation strictly when model download is required ('downloadable').
      // Never block already-'available' on-device models.
      const status = await factory.availability(mergedOptions);
      if (mountedRef.current) {
        setAvailability(status);
      }
      if (status === 'unavailable') {
        throw new Error(unsupportedMessage);
      }
      if (
        status === 'downloadable' &&
        typeof navigator !== 'undefined' &&
        navigator.userActivation &&
        !navigator.userActivation.isActive
      ) {
        throw new DOMException(
          'Downloading this on-device AI model requires an active user gesture.',
          'NotAllowedError'
        );
      }

      if (instanceRef.current) {
        instanceRef.current.destroy?.();
        instanceRef.current = null;
        activeOptionsKeyRef.current = '';
      }

      const expectedGen = ++generationRef.current;
      const createPromise = factory
        .create({
          ...(mergedOptions as TOptions),
          monitor(m: ModelMonitor) {
            m.addEventListener('downloadprogress', (e: DownloadProgressEvent) => {
              if (e.total > 0 && mountedRef.current && generationRef.current === expectedGen) {
                setDownloadProgress(Math.round((e.loaded / e.total) * 100));
              }
            });
          },
        })
        .then((instance) => {
          if (!mountedRef.current || generationRef.current !== expectedGen) {
            instance.destroy?.();
            throw new DOMException('AI session creation superseded or unmounted', 'AbortError');
          }
          instanceRef.current = instance;
          activeOptionsKeyRef.current = targetKey;
          if (pendingRef.current?.promise === createPromise) {
            pendingRef.current = null;
          }
          setDownloadProgress(null);
          return instance;
        })
        .catch((err) => {
          if (pendingRef.current?.promise === createPromise) {
            pendingRef.current = null;
          }
          throw err;
        });

      pendingRef.current = { key: targetKey, promise: createPromise };
      return createPromise;
    },
    [factory, unsupportedMessage, optionsRequired, missingOptionsMessage]
  );

  return {
    isSupported: Boolean(factory),
    availability,
    downloadProgress,
    error,
    setError,
    getOrCreateInstance,
  };
}

/**
 * React hook for on-device natural language generation using the Chrome 138+ Prompt API (Gemini Nano).
 */
export function useLanguageModel(defaultOptions?: LanguageModelOptions) {
  const [isPrompting, setIsPrompting] = React.useState(false);
  const [inputUsage, setInputUsage] = React.useState<number | null>(null);
  const [inputQuota, setInputQuota] = React.useState<number | null>(null);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.LanguageModel;
  }, []);

  const normalizedDefaultOptions = React.useMemo(
    () => normalizeLanguageModelOptions(defaultOptions),
    [defaultOptions]
  );

  const {
    isSupported,
    availability,
    downloadProgress,
    error,
    setError,
    getOrCreateInstance,
  } = useBuiltInAiSession<LanguageModelInstance, ChromeLanguageModelCreateOptions>(
    factory,
    'LanguageModel (Prompt API) is unsupported in this browser environment.',
    normalizedDefaultOptions
  );

  const syncUsageMetrics = React.useCallback((model: LanguageModelInstance) => {
    if (typeof model.inputUsage === 'number') setInputUsage(model.inputUsage);
    if (typeof model.inputQuota === 'number') setInputQuota(model.inputQuota);
  }, []);

  const prompt = React.useCallback(
    async (
      text: string,
      promptOpts?: LanguageModelPromptOptions,
      overrideOptions?: LanguageModelOptions
    ): Promise<string> => {
      setIsPrompting(true);
      setError(null);
      try {
        const model = await getOrCreateInstance(normalizeLanguageModelOptions(overrideOptions));
        syncUsageMetrics(model);
        const result = await model.prompt(text, promptOpts);
        syncUsageMetrics(model);
        return result;
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsPrompting(false);
      }
    },
    [getOrCreateInstance, setError, syncUsageMetrics]
  );

  const promptStreaming = React.useCallback(
    async (
      text: string,
      onChunk: (chunk: string) => void,
      promptOpts?: LanguageModelPromptOptions,
      overrideOptions?: LanguageModelOptions
    ): Promise<string> => {
      setIsPrompting(true);
      setError(null);
      let accumulated = '';
      try {
        const model = await getOrCreateInstance(normalizeLanguageModelOptions(overrideOptions));
        syncUsageMetrics(model);
        const stream = model.promptStreaming(text, promptOpts);
        for await (const chunk of stream) {
          accumulated += chunk;
          onChunk(chunk);
        }
        syncUsageMetrics(model);
        return accumulated;
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsPrompting(false);
      }
    },
    [getOrCreateInstance, setError, syncUsageMetrics]
  );

  const measureInputUsage = React.useCallback(
    async (text: string, options?: { signal?: AbortSignal }): Promise<number> => {
      const model = await getOrCreateInstance();
      syncUsageMetrics(model);
      if (typeof model.measureInputUsage === 'function') {
        return await model.measureInputUsage(text, options);
      }
      return Math.ceil(text.length / 4);
    },
    [getOrCreateInstance, syncUsageMetrics]
  );

  return {
    isSupported,
    availability,
    isPrompting,
    downloadProgress,
    inputUsage,
    inputQuota,
    error,
    prompt,
    promptStreaming,
    measureInputUsage,
  };
}

/**
 * React hook for on-device language identification using the Language Detector API.
 */
export function useLanguageDetector() {
  const [isDetecting, setIsDetecting] = React.useState(false);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.LanguageDetector;
  }, []);

  const {
    isSupported,
    availability,
    downloadProgress,
    error,
    setError,
    getOrCreateInstance,
  } = useBuiltInAiSession<LanguageDetectorInstance, {}>(
    factory,
    'LanguageDetector API is unsupported in this browser environment.'
  );

  const detect = React.useCallback(
    async (text: string, options?: DetectCallOptions): Promise<DetectedLanguageResult[]> => {
      setIsDetecting(true);
      setError(null);
      try {
        const detector = await getOrCreateInstance();
        return await detector.detect(text, options);
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsDetecting(false);
      }
    },
    [getOrCreateInstance, setError]
  );

  return {
    isSupported,
    availability,
    isDetecting,
    downloadProgress,
    error,
    detect,
  };
}

/**
 * React hook for on-device text distillation using the Summarizer API.
 */
export function useSummarizer(defaultOptions?: SummarizerOptions) {
  const [isSummarizing, setIsSummarizing] = React.useState(false);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.Summarizer;
  }, []);

  const {
    isSupported,
    availability,
    downloadProgress,
    error,
    setError,
    getOrCreateInstance,
  } = useBuiltInAiSession<SummarizerInstance, SummarizerOptions>(
    factory,
    'Summarizer API is unsupported in this browser environment.',
    defaultOptions
  );

  const summarize = React.useCallback(
    async (
      text: string,
      contextOptions?: SummarizeContextOptions,
      overrideOptions?: SummarizerOptions
    ): Promise<string> => {
      setIsSummarizing(true);
      setError(null);
      try {
        const summarizer = await getOrCreateInstance(overrideOptions);
        return await summarizer.summarize(text, contextOptions);
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsSummarizing(false);
      }
    },
    [getOrCreateInstance, setError]
  );

  const summarizeStreaming = React.useCallback(
    async (
      text: string,
      onChunk: (chunk: string) => void,
      contextOptions?: SummarizeContextOptions,
      overrideOptions?: SummarizerOptions
    ): Promise<string> => {
      setIsSummarizing(true);
      setError(null);
      let accumulated = '';
      try {
        const summarizer = await getOrCreateInstance(overrideOptions);
        const stream = summarizer.summarizeStreaming(text, contextOptions);
        for await (const chunk of stream) {
          accumulated += chunk;
          onChunk(chunk);
        }
        return accumulated;
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsSummarizing(false);
      }
    },
    [getOrCreateInstance, setError]
  );

  return {
    isSupported,
    availability,
    isSummarizing,
    downloadProgress,
    error,
    summarize,
    summarizeStreaming,
  };
}

/**
 * React hook for on-device translation using the Translator API.
 */
export function useTranslator(defaultOptions?: TranslatorOptions) {
  const [isTranslating, setIsTranslating] = React.useState(false);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.Translator;
  }, []);

  const {
    isSupported,
    availability,
    downloadProgress,
    error,
    setError,
    getOrCreateInstance,
  } = useBuiltInAiSession<TranslatorInstance, TranslatorOptions>(
    factory,
    'Translator API is unsupported in this browser environment.',
    defaultOptions,
    true,
    'Source and target languages are required to create a Translator.'
  );

  const translate = React.useCallback(
    async (
      text: string,
      optionsOrOverride?: TranslateCallOptions | TranslatorOptions,
      overrideOptions?: TranslatorOptions
    ): Promise<string> => {
      setIsTranslating(true);
      setError(null);
      try {
        const resolvedOverride = isTranslatorOptions(optionsOrOverride)
          ? optionsOrOverride
          : overrideOptions;
        const callOptions: TranslateCallOptions | undefined = isTranslatorOptions(optionsOrOverride)
          ? optionsOrOverride.signal
            ? { signal: optionsOrOverride.signal }
            : undefined
          : optionsOrOverride;
        const translator = await getOrCreateInstance(resolvedOverride);
        return await translator.translate(text, callOptions);
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsTranslating(false);
      }
    },
    [getOrCreateInstance, setError]
  );

  const translateStreaming = React.useCallback(
    async (
      text: string,
      onChunk: (chunk: string) => void,
      optionsOrOverride?: TranslateCallOptions | TranslatorOptions,
      overrideOptions?: TranslatorOptions
    ): Promise<string> => {
      setIsTranslating(true);
      setError(null);
      let accumulated = '';
      try {
        const resolvedOverride = isTranslatorOptions(optionsOrOverride)
          ? optionsOrOverride
          : overrideOptions;
        const callOptions: TranslateCallOptions | undefined = isTranslatorOptions(optionsOrOverride)
          ? optionsOrOverride.signal
            ? { signal: optionsOrOverride.signal }
            : undefined
          : optionsOrOverride;
        const translator = await getOrCreateInstance(resolvedOverride);
        const stream = translator.translateStreaming(text, callOptions);
        for await (const chunk of stream) {
          accumulated += chunk;
          onChunk(chunk);
        }
        return accumulated;
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsTranslating(false);
      }
    },
    [getOrCreateInstance, setError]
  );

  return {
    isSupported,
    availability,
    isTranslating,
    downloadProgress,
    error,
    translate,
    translateStreaming,
  };
}

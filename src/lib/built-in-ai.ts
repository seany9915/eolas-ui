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
}

export interface TranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
}

export interface LanguageModelPromptOptions {
  responseConstraint?: unknown;
  signal?: AbortSignal;
}

export interface LanguageModelOptions {
  systemPrompt?: string;
  initialPrompts?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  topK?: number;
  responseConstraint?: unknown;
}

export interface DetectedLanguageResult {
  detectedLanguage: string;
  confidence: number;
}

// Global W3C / Chrome Built-in AI interfaces
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
  summarizeStreaming(text: string): AsyncIterable<string>;
  destroy?(): void;
}

interface SummarizerFactory {
  availability(options?: SummarizerOptions): Promise<BuiltInAiAvailability>;
  create(options?: SummarizerOptions & { monitor?: (m: ModelMonitor) => void }): Promise<SummarizerInstance>;
}

interface TranslatorInstance {
  translate(text: string): Promise<string>;
  translateStreaming(text: string): AsyncIterable<string>;
  destroy?(): void;
}

interface TranslatorFactory {
  availability(options: TranslatorOptions): Promise<BuiltInAiAvailability>;
  create(options: TranslatorOptions & { monitor?: (m: ModelMonitor) => void }): Promise<TranslatorInstance>;
}

interface LanguageModelInstance {
  prompt(input: string, options?: LanguageModelPromptOptions): Promise<string>;
  promptStreaming(input: string, options?: LanguageModelPromptOptions): AsyncIterable<string>;
  countPromptTokens?(input: string): Promise<number>;
  clone?(): Promise<LanguageModelInstance>;
  destroy?(): void;
}

interface LanguageModelFactory {
  availability(options?: LanguageModelOptions): Promise<BuiltInAiAvailability>;
  create(options?: LanguageModelOptions & { monitor?: (m: ModelMonitor) => void }): Promise<LanguageModelInstance>;
}

interface LanguageDetectorInstance {
  detect(text: string): Promise<DetectedLanguageResult[]>;
  destroy?(): void;
}

interface LanguageDetectorFactory {
  availability(): Promise<BuiltInAiAvailability>;
  create(options?: { monitor?: (m: ModelMonitor) => void }): Promise<LanguageDetectorInstance>;
}

declare global {
  interface Window {
    Summarizer?: SummarizerFactory;
    Translator?: TranslatorFactory;
    LanguageModel?: LanguageModelFactory;
    LanguageDetector?: LanguageDetectorFactory;
    ai?: {
      languageModel?: LanguageModelFactory;
      languageDetector?: LanguageDetectorFactory;
      summarizer?: SummarizerFactory;
      translator?: TranslatorFactory;
    };
  }
}

function serializeAiOptions(options: unknown): string {
  if (!options) return '';
  try {
    return JSON.stringify(options);
  } catch {
    return '';
  }
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
 * React hook for on-device natural language generation using the Prompt API (Gemini Nano).
 */
export function useLanguageModel(defaultOptions?: LanguageModelOptions) {
  const [isPrompting, setIsPrompting] = React.useState(false);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.LanguageModel || window.ai?.languageModel;
  }, []);

  const {
    isSupported,
    availability,
    downloadProgress,
    error,
    setError,
    getOrCreateInstance,
  } = useBuiltInAiSession<LanguageModelInstance, LanguageModelOptions>(
    factory,
    'LanguageModel (Prompt API) is unsupported in this browser environment.',
    defaultOptions
  );

  const prompt = React.useCallback(
    async (
      text: string,
      promptOpts?: LanguageModelPromptOptions,
      overrideOptions?: LanguageModelOptions
    ): Promise<string> => {
      setIsPrompting(true);
      setError(null);
      try {
        const model = await getOrCreateInstance(overrideOptions);
        return await model.prompt(text, promptOpts);
      } catch (err: unknown) {
        const parsed = err instanceof Error ? err : new Error(String(err));
        setError(parsed);
        throw parsed;
      } finally {
        setIsPrompting(false);
      }
    },
    [getOrCreateInstance, setError]
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
        const model = await getOrCreateInstance(overrideOptions);
        const stream = model.promptStreaming(text, promptOpts);
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
        setIsPrompting(false);
      }
    },
    [getOrCreateInstance, setError]
  );

  const countTokens = React.useCallback(
    async (text: string): Promise<number> => {
      const model = await getOrCreateInstance();
      if (model.countPromptTokens) {
        return await model.countPromptTokens(text);
      }
      return Math.ceil(text.length / 4);
    },
    [getOrCreateInstance]
  );

  return {
    isSupported,
    availability,
    isPrompting,
    downloadProgress,
    error,
    prompt,
    promptStreaming,
    countTokens,
  };
}

/**
 * React hook for on-device language identification using the Language Detector API.
 */
export function useLanguageDetector() {
  const [isDetecting, setIsDetecting] = React.useState(false);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.LanguageDetector || window.ai?.languageDetector;
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
    async (text: string): Promise<DetectedLanguageResult[]> => {
      setIsDetecting(true);
      setError(null);
      try {
        const detector = await getOrCreateInstance();
        return await detector.detect(text);
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
    return window.Summarizer || window.ai?.summarizer;
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
      overrideOptions?: SummarizerOptions
    ): Promise<string> => {
      setIsSummarizing(true);
      setError(null);
      let accumulated = '';
      try {
        const summarizer = await getOrCreateInstance(overrideOptions);
        const stream = summarizer.summarizeStreaming(text);
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
    return window.Translator || window.ai?.translator;
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
    async (text: string, overrideOptions?: TranslatorOptions): Promise<string> => {
      setIsTranslating(true);
      setError(null);
      try {
        const translator = await getOrCreateInstance(overrideOptions);
        return await translator.translate(text);
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
      overrideOptions?: TranslatorOptions
    ): Promise<string> => {
      setIsTranslating(true);
      setError(null);
      let accumulated = '';
      try {
        const translator = await getOrCreateInstance(overrideOptions);
        const stream = translator.translateStreaming(text);
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

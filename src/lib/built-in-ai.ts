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

/**
 * React hook for on-device natural language generation using the Prompt API (Gemini Nano).
 */
export function useLanguageModel(defaultOptions?: LanguageModelOptions) {
  const [availability, setAvailability] = React.useState<BuiltInAiAvailability>('unavailable');
  const [isPrompting, setIsPrompting] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const instanceRef = React.useRef<LanguageModelInstance | null>(null);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.LanguageModel || window.ai?.languageModel;
  }, []);

  const isSupported = Boolean(factory);

  React.useEffect(() => {
    if (!factory) {
      setAvailability('unavailable');
      return;
    }

    let active = true;
    factory
      .availability(defaultOptions)
      .then((status) => {
        if (active) setAvailability(status);
      })
      .catch((err: unknown) => {
        if (active) {
          setAvailability('unavailable');
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      active = false;
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [factory, defaultOptions]);

  const getOrCreateInstance = React.useCallback(
    async (opts?: LanguageModelOptions) => {
      if (!factory) {
        throw new Error('LanguageModel (Prompt API) is unsupported in this browser environment.');
      }

      if (instanceRef.current) {
        return instanceRef.current;
      }

      const mergedOptions: LanguageModelOptions = { ...defaultOptions, ...opts };
      const instance = await factory.create({
        ...mergedOptions,
        monitor(m: ModelMonitor) {
          m.addEventListener('downloadprogress', (e: DownloadProgressEvent) => {
            if (e.total > 0) {
              setDownloadProgress(Math.round((e.loaded / e.total) * 100));
            }
          });
        },
      });

      instanceRef.current = instance;
      setDownloadProgress(null);
      return instance;
    },
    [factory, defaultOptions]
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
    [getOrCreateInstance]
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
    [getOrCreateInstance]
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
  const [availability, setAvailability] = React.useState<BuiltInAiAvailability>('unavailable');
  const [isDetecting, setIsDetecting] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const instanceRef = React.useRef<LanguageDetectorInstance | null>(null);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.LanguageDetector || window.ai?.languageDetector;
  }, []);

  const isSupported = Boolean(factory);

  React.useEffect(() => {
    if (!factory) {
      setAvailability('unavailable');
      return;
    }

    let active = true;
    factory
      .availability()
      .then((status) => {
        if (active) setAvailability(status);
      })
      .catch((err: unknown) => {
        if (active) {
          setAvailability('unavailable');
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      active = false;
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [factory]);

  const getOrCreateInstance = React.useCallback(async () => {
    if (!factory) {
      throw new Error('LanguageDetector API is unsupported in this browser environment.');
    }

    if (instanceRef.current) {
      return instanceRef.current;
    }

    const instance = await factory.create({
      monitor(m: ModelMonitor) {
        m.addEventListener('downloadprogress', (e: DownloadProgressEvent) => {
          if (e.total > 0) {
            setDownloadProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
      },
    });

    instanceRef.current = instance;
    setDownloadProgress(null);
    return instance;
  }, [factory]);

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
    [getOrCreateInstance]
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
  const [availability, setAvailability] = React.useState<BuiltInAiAvailability>('unavailable');
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const instanceRef = React.useRef<SummarizerInstance | null>(null);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.Summarizer || window.ai?.summarizer;
  }, []);

  const isSupported = Boolean(factory);

  React.useEffect(() => {
    if (!factory) {
      setAvailability('unavailable');
      return;
    }

    let active = true;
    factory
      .availability(defaultOptions)
      .then((status) => {
        if (active) setAvailability(status);
      })
      .catch((err: unknown) => {
        if (active) {
          setAvailability('unavailable');
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      active = false;
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [factory, defaultOptions]);

  const getOrCreateInstance = React.useCallback(
    async (opts?: SummarizerOptions) => {
      if (!factory) {
        throw new Error('Summarizer API is unsupported in this browser environment.');
      }

      if (instanceRef.current) {
        return instanceRef.current;
      }

      const mergedOptions: SummarizerOptions = { ...defaultOptions, ...opts };
      const instance = await factory.create({
        ...mergedOptions,
        monitor(m: ModelMonitor) {
          m.addEventListener('downloadprogress', (e: DownloadProgressEvent) => {
            if (e.total > 0) {
              setDownloadProgress(Math.round((e.loaded / e.total) * 100));
            }
          });
        },
      });

      instanceRef.current = instance;
      setDownloadProgress(null);
      return instance;
    },
    [factory, defaultOptions]
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
    [getOrCreateInstance]
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
    [getOrCreateInstance]
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
  const [availability, setAvailability] = React.useState<BuiltInAiAvailability>('unavailable');
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const instanceRef = React.useRef<TranslatorInstance | null>(null);

  const factory = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.Translator || window.ai?.translator;
  }, []);

  const isSupported = Boolean(factory);

  React.useEffect(() => {
    if (!factory || !defaultOptions) {
      setAvailability('unavailable');
      return;
    }

    let active = true;
    factory
      .availability(defaultOptions)
      .then((status) => {
        if (active) setAvailability(status);
      })
      .catch((err: unknown) => {
        if (active) {
          setAvailability('unavailable');
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      active = false;
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [factory, defaultOptions]);

  const getOrCreateInstance = React.useCallback(
    async (opts?: TranslatorOptions) => {
      if (!factory) {
        throw new Error('Translator API is unsupported in this browser environment.');
      }

      if (instanceRef.current) {
        return instanceRef.current;
      }

      const options = opts || defaultOptions;
      if (!options) {
        throw new Error('Source and target languages are required to create a Translator.');
      }

      const instance = await factory.create({
        ...options,
        monitor(m: ModelMonitor) {
          m.addEventListener('downloadprogress', (e: DownloadProgressEvent) => {
            if (e.total > 0) {
              setDownloadProgress(Math.round((e.loaded / e.total) * 100));
            }
          });
        },
      });

      instanceRef.current = instance;
      setDownloadProgress(null);
      return instance;
    },
    [factory, defaultOptions]
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
    [getOrCreateInstance]
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
    [getOrCreateInstance]
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

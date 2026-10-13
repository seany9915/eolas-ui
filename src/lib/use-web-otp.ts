/**
 * WebOTP API auto-extraction hook.
 *
 * Platform Reference: Modern Web Guidance (MWG: sms-otp-form)
 *
 * Provides lifecycle-bound SMS one-time passcode listening using the native
 * WebOTP API (OTPCredential) with AbortController cancellation.
 */
import * as React from 'react';

interface OTPCredential extends Credential {
  code: string;
}

interface CredentialRequestOptionsWithOTP extends CredentialRequestOptions {
  otp?: {
    transport: string[];
  };
}

function isOTPCredential(credential: Credential | null): credential is OTPCredential {
  return (
    credential !== null &&
    'code' in credential &&
    typeof (credential as { code: unknown }).code === 'string'
  );
}

export interface UseWebOtpOptions {
  /** Whether the WebOTP listener is actively listening for an incoming SMS OTP */
  enabled?: boolean;
  /** Callback fired when an OTP is received and parsed by the browser */
  onCodeReceived?: (code: string) => void;
}

export interface UseWebOtpReturn {
  /** Whether the current browser supports the WebOTP API */
  isSupported: boolean;
  /** Whether the hook is currently awaiting an incoming SMS OTP */
  isListening: boolean;
  /** Manually cancels the in-flight WebOTP listener */
  cancel: () => void;
  /** Any unexpected runtime error encountered during listening */
  error: Error | null;
}

export function useWebOtp({
  enabled = true,
  onCodeReceived,
}: UseWebOtpOptions = {}): UseWebOtpReturn {
  const [isListening, setIsListening] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const isSupported = React.useMemo(() => {
    return (
      typeof window !== 'undefined' &&
      'OTPCredential' in window &&
      'credentials' in navigator
    );
  }, []);

  const cancel = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsListening(false);
  }, []);

  React.useEffect(() => {
    if (!enabled || !isSupported) {
      cancel();
      return;
    }

    cancel();
    const ac = new AbortController();
    abortControllerRef.current = ac;
    setIsListening(true);
    setError(null);

    const listenForOtp = async () => {
      try {
        const options: CredentialRequestOptionsWithOTP = {
          otp: { transport: ['sms'] },
          signal: ac.signal,
        };

        const credential = await navigator.credentials.get(options);

        if (isOTPCredential(credential)) {
          onCodeReceived?.(credential.code);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsListening(false);
      }
    };

    listenForOtp();

    return () => {
      cancel();
    };
  }, [enabled, isSupported, cancel, onCodeReceived]);

  return {
    isSupported,
    isListening,
    cancel,
    error,
  };
}

export default useWebOtp;

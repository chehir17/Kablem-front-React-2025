import { useState, useCallback } from 'react';
import { useDebounceApi } from './useDebounce';

/**
 * Hook pour les appels API avec debounce et gestion d'état
 */
export function useApiDebounce<T = any>(delay: number = 500) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { debounceApiCall, cancel, reset } = useDebounceApi(delay);

  /**
   * Exécute un appel API avec debounce
   */
  const executeDebouncedApi = useCallback(
    async (apiCall: () => Promise<T>, options: {
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
      onFinally?: () => void;
    } = {}) => {
      const { onSuccess, onError, onFinally } = options;

      debounceApiCall(
        async () => {
          try {
            setLoading(true);
            setError(null);
            const result = await apiCall();
            onSuccess?.(result);
            // do not return the result so the function has type Promise<void>
          } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
            setError(errorMessage);
            onError?.(err);
            throw err;
          } finally {
            setLoading(false);
            onFinally?.();
          }
        },
        {
          onStart: () => setLoading(true),
          onComplete: () => setLoading(false)
        }
      );
    },
    [debounceApiCall]
  );

  return {
    executeDebouncedApi,
    loading,
    error,
    setError,
    cancel,
    reset
  };
}
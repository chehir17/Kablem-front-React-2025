import { useState, useCallback, useRef } from 'react';

interface UseApiDebounceOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  maxRetries?: number;
  retryDelay?: number;
}

export function useApiDebounce<T = any>(delay: number = 1000) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isExecutingRef = useRef(false);
  const blockedUntilRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);
  const maxRetriesRef = useRef<number>(3);

  const executeDebouncedApi = useCallback(
    async (
      apiCall: () => Promise<T>, 
      options: UseApiDebounceOptions<T> = {}
    ) => {
      const { onSuccess, onError, maxRetries = 3, retryDelay = 5000 } = options;
      maxRetriesRef.current = maxRetries;

      // Vérifier si nous sommes bloqués
      const now = Date.now();
      if (blockedUntilRef.current > now) {
        const remainingTime = Math.ceil((blockedUntilRef.current - now) / 1000);
        const errorMessage = `Trop de requêtes - Réessayez dans ${remainingTime}s`;
        setError(errorMessage);
        onError?.(new Error(errorMessage));
        return Promise.reject(new Error(errorMessage));
      }

      // Annuler la requête précédente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Éviter les appels multiples
      if (isExecutingRef.current) {
        console.log('⏳ Requête déjà en cours...');
        return Promise.reject(new Error('Requête déjà en cours'));
      }

      return new Promise<T>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            isExecutingRef.current = true;
            setLoading(true);
            setError(null);
            
            console.log('🔄 Exécution de la requête API...');
            const result = await apiCall();
            
            // Réinitialiser le compteur de retry en cas de succès
            retryCountRef.current = 0;
            
            console.log('✅ Requête API réussie');
            onSuccess?.(result);
            resolve(result);
          } catch (err: any) {
            console.error('❌ Erreur API:', err);
            
            // Gestion spécifique de l'erreur 429
            if (err.response?.status === 429) {
              const retryAfter = err.response.headers?.['retry-after'];
              const blockDuration = retryAfter ? parseInt(retryAfter) * 1000 : 30000; // 30s par défaut
              
              blockedUntilRef.current = Date.now() + blockDuration;
              
              // Logique de retry
              if (retryCountRef.current < maxRetriesRef.current) {
                retryCountRef.current++;
                console.log(`🔄 Retry ${retryCountRef.current}/${maxRetriesRef.current} dans ${retryDelay}ms`);
                
                // Retry après le délai
                setTimeout(() => {
                  executeDebouncedApi(apiCall, options)
                    .then(resolve)
                    .catch(reject);
                }, retryDelay);
                
                return;
              }
              
              const errorMessage = `Trop de requêtes - Veuillez patienter ${Math.ceil(blockDuration/1000)}s`;
              setError(errorMessage);
              onError?.(new Error(errorMessage));
              reject(new Error(errorMessage));
            } else {
              // Pour les autres erreurs
              const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
              setError(errorMessage);
              onError?.(err);
              reject(err);
            }
          } finally {
            setLoading(false);
            isExecutingRef.current = false;
            timeoutRef.current = null;
          }
        }, delay);
      });
    },
    [delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLoading(false);
    isExecutingRef.current = false;
    retryCountRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    cancel();
    setError(null);
    blockedUntilRef.current = 0;
    retryCountRef.current = 0;
  }, [cancel]);

  return {
    executeDebouncedApi,
    loading,
    error,
    setError,
    cancel,
    reset
  };
}
import { useRef, useCallback } from 'react';

/**
 * Hook personnalisé pour le debouncing des fonctions
 * @param delay - Délai en millisecondes (défaut: 500ms)
 * @returns Fonction debounced et fonction d'annulation
 */
export function useDebounce(delay: number = 500) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Annule le debounce en cours
   */
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Fonction debounced
   * @param callback - Fonction à exécuter après le délai
   */
  const debouncedFunction = useCallback(
    (callback: () => void) => {
      // Annule la précédente exécution
      cancel();

      // Planifie la nouvelle exécution
      timeoutRef.current = setTimeout(() => {
        callback();
        timeoutRef.current = null;
      }, delay);
    },
    [delay, cancel]
  );

  // Nettoyage à la destruction du composant
  const reset = useCallback(() => {
    cancel();
  }, [cancel]);

  return {
    debounce: debouncedFunction,
    cancel,
    reset
  };
}

/**
 * Version spécialisée pour les appels API
 */
export function useDebounceApi(delay: number = 500) {
  const { debounce, cancel, reset } = useDebounce(delay);

  /**
   * Debounce spécialisé pour les appels API avec gestion de loading
   */
  const debounceApiCall = useCallback(
    (apiCall: () => Promise<void>, options: { onStart?: () => void; onComplete?: () => void } = {}) => {
      const { onStart, onComplete } = options;
      
      debounce(async () => {
        try {
          onStart?.();
          await apiCall();
        } finally {
          onComplete?.();
        }
      });
    },
    [debounce]
  );

  return {
    debounceApiCall,
    cancel,
    reset
  };
}
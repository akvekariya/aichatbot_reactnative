import { useCallback, useState } from 'react';
import { isNetworkError } from '../utils';

interface UseRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}

interface UseRetryReturn<T> {
  execute: () => Promise<T>;
  isRetrying: boolean;
  retryCount: number;
  reset: () => void;
}

export const useRetry = <T>(
  asyncFunction: () => Promise<T>,
  options: UseRetryOptions = {},
): UseRetryReturn<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true,
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async (): Promise<T> => {
    let currentRetry = 0;
    setIsRetrying(false);
    setRetryCount(0);

    const attemptExecution = async (): Promise<T> => {
      try {
        const result = await asyncFunction();
        setRetryCount(currentRetry);
        setIsRetrying(false);
        return result;
      } catch (error) {
        currentRetry++;
        setRetryCount(currentRetry);

        // Check if we should retry
        const shouldRetry = currentRetry <= maxRetries && isNetworkError(error);

        if (shouldRetry) {
          setIsRetrying(true);

          // Calculate delay with exponential backoff
          const delay = exponentialBackoff
            ? retryDelay * Math.pow(2, currentRetry - 1)
            : retryDelay;

          console.log(
            `Retrying in ${delay}ms (attempt ${currentRetry}/${maxRetries})`,
          );

          await new Promise<void>(resolve => setTimeout(resolve, delay));
          return attemptExecution();
        } else {
          setIsRetrying(false);
          throw error;
        }
      }
    };

    return attemptExecution();
  }, [asyncFunction, maxRetries, retryDelay, exponentialBackoff]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
  }, []);

  return {
    execute,
    isRetrying,
    retryCount,
    reset,
  };
};

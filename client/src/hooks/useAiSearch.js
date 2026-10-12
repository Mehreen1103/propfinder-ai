import { useCallback, useState } from 'react';
import { aiSearch } from '../api/client.js';

/** Calls the natural-language search endpoint and hands the result to `onResult`. */
export function useAiSearch(onResult) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const search = useCallback(
    async (query) => {
      setLoading(true);
      setError('');
      setWarning('');
      try {
        const data = await aiSearch(query);
        onResult(data.filters, data.listings);
        setWarning(data.warning || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [onResult],
  );

  const clearMessages = useCallback(() => {
    setError('');
    setWarning('');
  }, []);

  return { search, loading, error, warning, clearMessages };
}

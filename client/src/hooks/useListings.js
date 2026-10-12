import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchListings } from '../api/client.js';

export const EMPTY_FILTERS = {
  location: '',
  bedrooms: '',
  minPrice: '',
  maxPrice: '',
  propertyType: '',
  features: [],
  sort: '',
};

const fromServer = (f = {}) => ({
  ...EMPTY_FILTERS,
  location: f.location ?? '',
  bedrooms: f.bedrooms ?? '',
  minPrice: f.minPrice ?? '',
  maxPrice: f.maxPrice ?? '',
  propertyType: f.propertyType ?? '',
  features: f.features ?? [],
});

/**
 * Owns the filter state and the listings it produces. Manual filter changes
 * refetch (debounced); AI results arrive already filtered, so they set the
 * state without triggering a second fetch.
 */
export function useListings() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const skipNextFetch = useRef(false);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      fetchListings(filters, controller.signal)
        .then((data) => {
          setListings(data.listings);
          setError('');
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setError(err.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  const updateFilters = useCallback(
    (patch) => setFilters((prev) => ({ ...prev, ...patch })),
    [],
  );

  const resetFilters = useCallback(() => setFilters({ ...EMPTY_FILTERS }), []);

  const applyAiResult = useCallback((aiFilters, aiListings) => {
    skipNextFetch.current = true;
    setFilters(fromServer(aiFilters));
    setListings(aiListings);
    setError('');
    setLoading(false);
  }, []);

  return {
    filters,
    listings,
    loading,
    error,
    updateFilters,
    resetFilters,
    applyAiResult,
  };
}

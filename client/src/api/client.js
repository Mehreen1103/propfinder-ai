const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error("Can't reach the API server. Check that the backend is running and VITE_API_URL is correct.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // An empty, non-JSON error means the proxy or host could not reach the backend.
    if (!data.error && res.status >= 500) {
      throw new Error("The API server isn't responding. Start the backend (npm run dev) and try again.");
    }
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function fetchListings(filters, signal) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'features') {
      if (value.length) params.set('features', value.join(','));
    } else if (value !== '' && value !== undefined && value !== null) {
      params.set(key, value);
    }
  }
  return request(`/api/listings?${params}`, { signal });
}

export function aiSearch(query) {
  return request('/api/search/ai', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

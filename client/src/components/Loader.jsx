import { useEffect, useState } from 'react';

export default function Loader({ label = 'Loading listings...' }) {
  const [slow, setSlow] = useState(false);

  // The free Render tier sleeps when idle; explain a long first load instead of looking broken.
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="loader" role="status">
      <div className="loader__spinner" aria-hidden="true" />
      <p>{label}</p>
      {slow && (
        <p className="loader__hint">
          The free server may be waking up. This can take up to 30 seconds on the first request.
        </p>
      )}
    </div>
  );
}

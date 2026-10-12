import { useState } from 'react';

const EXAMPLES = [
  '2-bedroom flat in Chittagong under 50 lakh with parking',
  'Furnished flat in Khulshi with lift and generator',
  '3 bed house in Dhaka above 1 crore',
];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q && !loading) onSearch(q);
  };

  const runExample = (text) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <section className="search" aria-label="AI search">
      <form className="search__form" onSubmit={submit}>
        <input
          className="search__input"
          type="text"
          value={query}
          maxLength={200}
          placeholder="Describe what you are looking for, in plain English"
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
        />
        <button className="btn btn--primary" type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search with AI'}
        </button>
      </form>
      <div className="search__examples">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="link-btn"
            disabled={loading}
            onClick={() => runExample(ex)}
          >
            {ex}
          </button>
        ))}
      </div>
    </section>
  );
}

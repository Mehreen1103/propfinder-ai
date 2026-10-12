import { useCallback } from 'react';
import { useListings } from './hooks/useListings.js';
import { useAiSearch } from './hooks/useAiSearch.js';
import SearchBar from './components/SearchBar.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import AiFilterChips from './components/AiFilterChips.jsx';
import ListingGrid from './components/ListingGrid.jsx';
import Loader from './components/Loader.jsx';
import EmptyState from './components/EmptyState.jsx';

export default function App() {
  const { filters, listings, loading, error, updateFilters, resetFilters, applyAiResult } =
    useListings();
  const ai = useAiSearch(applyAiResult);

  const handleFilterChange = useCallback(
    (patch) => {
      ai.clearMessages();
      updateFilters(patch);
    },
    [ai, updateFilters],
  );

  const handleReset = useCallback(() => {
    ai.clearMessages();
    resetFilters();
  }, [ai, resetFilters]);

  const busy = loading || ai.loading;

  return (
    <div className="app">
      <header className="header">
        <h1>
          PropFinder <span>AI</span>
        </h1>
        <p>Search property listings the way you would describe them to a friend.</p>
      </header>

      <main className="container">
        <SearchBar onSearch={ai.search} loading={ai.loading} />

        {ai.error && <div className="banner banner--error">{ai.error}</div>}
        {ai.warning && <div className="banner banner--warn">{ai.warning}</div>}

        <AiFilterChips filters={filters} onChange={handleFilterChange} />

        <div className="layout">
          <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />

          <section className="results" aria-live="polite">
            {error && <div className="banner banner--error">{error}</div>}
            {busy ? (
              <Loader label={ai.loading ? 'Understanding your search...' : 'Loading listings...'} />
            ) : (
              <>
                <p className="results__count">
                  {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
                </p>
                {listings.length === 0 && !error ? (
                  <EmptyState onReset={handleReset} />
                ) : (
                  <ListingGrid listings={listings} />
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        Demo project. Listings are sample data. Natural-language search runs on Groq via LangChain and LangGraph.
      </footer>
    </div>
  );
}

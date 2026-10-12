export default function EmptyState({ onReset }) {
  return (
    <div className="empty">
      <h3>No listings match these filters</h3>
      <p>Try removing a filter or widening your price range.</p>
      <button type="button" className="btn" onClick={onReset}>
        Clear all filters
      </button>
    </div>
  );
}

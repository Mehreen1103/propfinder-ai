import { LAKH, titleCase } from '../utils/format.js';

export const FEATURE_OPTIONS = [
  'parking',
  'lift',
  'balcony',
  'generator',
  'gas',
  'security',
  'furnished',
];
const TYPES = ['flat', 'house', 'land', 'commercial'];

// Prices are stored in BDT but edited in lakh, which is how people think about them.
const toLakh = (v) => (v === '' ? '' : v / LAKH);
const fromLakh = (v) => (v === '' ? '' : Number(v) * LAKH);

export default function FilterPanel({ filters, onChange, onReset }) {
  const toggleFeature = (feature) => {
    const has = filters.features.includes(feature);
    onChange({
      features: has
        ? filters.features.filter((f) => f !== feature)
        : [...filters.features, feature],
    });
  };

  return (
    <aside className="panel" aria-label="Filters">
      <div className="panel__head">
        <h2>Filters</h2>
        <button type="button" className="link-btn" onClick={onReset}>
          Reset
        </button>
      </div>

      <label className="field">
        <span>Location</span>
        <input
          type="text"
          value={filters.location}
          placeholder="City or area"
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Property type</span>
        <select
          value={filters.propertyType}
          onChange={(e) => onChange({ propertyType: e.target.value })}
        >
          <option value="">Any</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {titleCase(t)}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Bedrooms</span>
        <select
          value={filters.bedrooms}
          onChange={(e) =>
            onChange({ bedrooms: e.target.value === '' ? '' : Number(e.target.value) })
          }
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <div className="field-row">
        <label className="field">
          <span>Min price (lakh)</span>
          <input
            type="number"
            min="0"
            step="any"
            value={toLakh(filters.minPrice)}
            onChange={(e) => onChange({ minPrice: fromLakh(e.target.value) })}
          />
        </label>
        <label className="field">
          <span>Max price (lakh)</span>
          <input
            type="number"
            min="0"
            step="any"
            value={toLakh(filters.maxPrice)}
            onChange={(e) => onChange({ maxPrice: fromLakh(e.target.value) })}
          />
        </label>
      </div>

      <fieldset className="field">
        <legend>Features</legend>
        <div className="checks">
          {FEATURE_OPTIONS.map((f) => (
            <label key={f} className="check">
              <input
                type="checkbox"
                checked={filters.features.includes(f)}
                onChange={() => toggleFeature(f)}
              />
              <span>{titleCase(f)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>Sort by</span>
        <select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
          <option value="">Default</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="size_desc">Size: largest first</option>
        </select>
      </label>
    </aside>
  );
}

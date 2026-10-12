import { formatBDT, titleCase } from '../utils/format.js';

/** Shows every active filter as a removable chip (including the ones the AI extracted). */
export default function AiFilterChips({ filters, onChange }) {
  const chips = [];

  if (filters.location) {
    chips.push({ id: 'location', label: `Location: ${filters.location}`, clear: { location: '' } });
  }
  if (filters.propertyType) {
    chips.push({ id: 'type', label: titleCase(filters.propertyType), clear: { propertyType: '' } });
  }
  if (filters.bedrooms !== '') {
    chips.push({ id: 'beds', label: `${filters.bedrooms} bedroom`, clear: { bedrooms: '' } });
  }
  if (filters.minPrice !== '') {
    chips.push({ id: 'min', label: `From ${formatBDT(filters.minPrice)}`, clear: { minPrice: '' } });
  }
  if (filters.maxPrice !== '') {
    chips.push({ id: 'max', label: `Up to ${formatBDT(filters.maxPrice)}`, clear: { maxPrice: '' } });
  }
  for (const f of filters.features) {
    chips.push({
      id: `f-${f}`,
      label: titleCase(f),
      clear: { features: filters.features.filter((x) => x !== f) },
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul className="chips" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.id} className="chip">
          <span>{chip.label}</span>
          <button
            type="button"
            aria-label={`Remove filter ${chip.label}`}
            onClick={() => onChange(chip.clear)}
          >
            x
          </button>
        </li>
      ))}
    </ul>
  );
}

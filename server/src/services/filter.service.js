/**
 * Pure functions: apply a sanitized filter object to a list of listings.
 * `bedrooms` is an exact match; `features` must all be present.
 */
export function applyFilters(listings, filters = {}) {
  const { location, bedrooms, minPrice, maxPrice, propertyType, features } =
    filters;
  const loc = location?.toLowerCase();

  return listings.filter((l) => {
    if (loc && !`${l.city} ${l.area}`.toLowerCase().includes(loc)) return false;
    if (bedrooms !== undefined && l.bedrooms !== bedrooms) return false;
    if (minPrice !== undefined && l.price < minPrice) return false;
    if (maxPrice !== undefined && l.price > maxPrice) return false;
    if (propertyType && l.propertyType !== propertyType) return false;
    if (features?.length && !features.every((f) => l.features.includes(f))) {
      return false;
    }
    return true;
  });
}

export function sortListings(listings, sort) {
  const copy = [...listings];
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'size_desc':
      return copy.sort((a, b) => b.sizeSqft - a.sizeSqft);
    default:
      return copy;
  }
}

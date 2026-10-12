import { getAllListings, getListingById } from '../services/listings.service.js';
import { applyFilters, sortListings } from '../services/filter.service.js';
import { sanitizeFilters, SORT_OPTIONS } from '../validators/filterSchema.js';

export function listListings(req, res) {
  const { location, bedrooms, minPrice, maxPrice, propertyType, features, sort } =
    req.query;
  const filters = sanitizeFilters({
    location,
    bedrooms,
    minPrice,
    maxPrice,
    propertyType,
    features,
  });
  const sortKey = SORT_OPTIONS.includes(sort) ? sort : undefined;
  const listings = sortListings(applyFilters(getAllListings(), filters), sortKey);
  res.json({ filters, count: listings.length, listings });
}

export function getListing(req, res) {
  const listing = getListingById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  res.json(listing);
}

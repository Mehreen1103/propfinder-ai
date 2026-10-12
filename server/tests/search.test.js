import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeFilters } from '../src/validators/filterSchema.js';
import { applyFilters } from '../src/services/filter.service.js';
import { getAllListings } from '../src/services/listings.service.js';
import { searchGraph } from '../src/ai/searchGraph.js';

test('sanitizeFilters keeps valid fields and drops junk', () => {
  const f = sanitizeFilters({
    location: 'Chattogram',
    bedrooms: '2',
    maxPrice: 5000000,
    propertyType: 'Apartment',
    features: ['Parking', 'jacuzzi', 'parking'],
    evil: 'DROP TABLE',
    minPrice: null,
  });
  assert.deepEqual(f, {
    location: 'Chittagong',
    bedrooms: 2,
    maxPrice: 5000000,
    propertyType: 'flat',
    features: ['parking'],
  });
});

test('sanitizeFilters swaps inverted price range and tolerates garbage', () => {
  assert.deepEqual(sanitizeFilters({ minPrice: 9, maxPrice: 3 }), {
    minPrice: 3,
    maxPrice: 9,
  });
  assert.deepEqual(sanitizeFilters('nope'), {});
  assert.deepEqual(sanitizeFilters({ bedrooms: 'many', maxPrice: -5 }), {});
});

test('applyFilters matches the headline example query', () => {
  const result = applyFilters(getAllListings(), {
    location: 'Chittagong',
    bedrooms: 2,
    maxPrice: 5000000,
    propertyType: 'flat',
    features: ['parking'],
  });
  assert.deepEqual(result.map((l) => l.id).sort((a, b) => a - b), [1, 3]);
});

test('search graph falls back to all listings when the LLM is unavailable', async () => {
  // No GROQ_API_KEY in the test environment, so the extract node fails.
  const out = await searchGraph.invoke({ query: 'any 2 bed flat' });
  assert.equal(out.aiUsed, false);
  assert.equal(out.listings.length, getAllListings().length);
  assert.ok(out.warning);
});

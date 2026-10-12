import { z } from 'zod';

export const FEATURES = [
  'parking',
  'lift',
  'balcony',
  'generator',
  'gas',
  'security',
  'furnished',
];
export const PROPERTY_TYPES = ['flat', 'house', 'land', 'commercial'];
export const SORT_OPTIONS = ['price_asc', 'price_desc', 'size_desc'];

const TYPE_ALIASES = {
  apartment: 'flat',
  condo: 'flat',
  home: 'house',
  villa: 'house',
  duplex: 'house',
  plot: 'land',
  office: 'commercial',
  shop: 'commercial',
};

const FEATURE_ALIASES = {
  elevator: 'lift',
  'car parking': 'parking',
  garage: 'parking',
  'gas line': 'gas',
  cctv: 'security',
};

const price = z.coerce.number().positive().max(1e11);

const fieldSchemas = {
  location: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .transform((s) => s.replace(/chattogram|chattagram/i, 'Chittagong')),
  bedrooms: z.coerce.number().int().min(1).max(10),
  minPrice: price,
  maxPrice: price,
  propertyType: z.preprocess((v) => {
    if (typeof v !== 'string') return v;
    const t = v.trim().toLowerCase();
    return TYPE_ALIASES[t] ?? t;
  }, z.enum(PROPERTY_TYPES)),
};

const isEmpty = (v) => v === undefined || v === null || v === '';

function normalizeFeatures(value) {
  const list = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];
  const cleaned = list
    .map((f) => String(f).trim().toLowerCase())
    .map((f) => FEATURE_ALIASES[f] ?? f)
    .filter((f) => FEATURES.includes(f));
  return [...new Set(cleaned)];
}

/**
 * Turns untrusted input (LLM output or query-string values) into a safe filter
 * object. Invalid fields are dropped individually instead of failing everything.
 */
export function sanitizeFilters(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const out = {};
  for (const [key, schema] of Object.entries(fieldSchemas)) {
    if (isEmpty(raw[key])) continue;
    const result = schema.safeParse(raw[key]);
    if (result.success) out[key] = result.data;
  }

  const features = normalizeFeatures(raw.features);
  if (features.length) out.features = features;

  if (
    out.minPrice !== undefined &&
    out.maxPrice !== undefined &&
    out.minPrice > out.maxPrice
  ) {
    [out.minPrice, out.maxPrice] = [out.maxPrice, out.minPrice];
  }

  return out;
}

export const searchBodySchema = z.object({
  query: z
    .string({ error: 'query must be a string' })
    .trim()
    .min(1, 'query is required')
    .max(200, 'query must be 200 characters or fewer'),
});

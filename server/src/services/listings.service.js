import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dataPath = fileURLToPath(new URL('../data/listings.json', import.meta.url));
const listings = JSON.parse(readFileSync(dataPath, 'utf8'));

export const getAllListings = () => listings;

export const getListingById = (id) =>
  listings.find((l) => l.id === Number(id)) ?? null;

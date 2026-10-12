import { searchGraph } from '../ai/searchGraph.js';

/** Runs the LangGraph search pipeline and returns the API response shape. */
export async function searchWithNaturalLanguage(query) {
  const { filters, listings, aiUsed, warning } = await searchGraph.invoke({
    query,
  });
  return { filters, listings, aiUsed, ...(warning ? { warning } : {}) };
}

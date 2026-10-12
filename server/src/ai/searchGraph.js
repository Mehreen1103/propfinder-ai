import { Annotation, StateGraph, START, END } from '@langchain/langgraph';
import { env } from '../config/env.js';
import { extractFilters } from './filterChain.js';
import { sanitizeFilters } from '../validators/filterSchema.js';
import { getAllListings } from '../services/listings.service.js';
import { applyFilters } from '../services/filter.service.js';

/**
 * LangGraph pipeline for natural-language search:
 *
 *   START -> extract --(got JSON)--> validate -> search -> END
 *               \--(LLM failed)---------------> search -> END   (fallback: all listings)
 */
const SearchState = Annotation.Root({
  query: Annotation(),
  rawFilters: Annotation(),
  filters: Annotation({ reducer: (_, next) => next, default: () => ({}) }),
  listings: Annotation({ reducer: (_, next) => next, default: () => [] }),
  aiUsed: Annotation({ reducer: (_, next) => next, default: () => false }),
  warning: Annotation(),
});

/** Short, user-safe explanation of why the Groq call failed (never includes the key). */
export function explainLlmError(err) {
  if (!env.groqApiKey) {
    return 'GROQ_API_KEY is not set. Put it in the .env file in the project root and restart the backend.';
  }
  const status = err?.status ?? err?.response?.status;
  if (status === 401 || status === 403) {
    return `Groq rejected the API key (${status}). Check GROQ_API_KEY for typos or extra spaces.`;
  }
  if (status === 404 || status === 400) {
    return `Groq did not accept the request (${status}). The model "${env.groqModel}" may be unavailable; try another GROQ_MODEL.`;
  }
  if (status === 429) {
    return 'Groq rate limit reached (429). Wait a minute and try again.';
  }
  if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
    return `Groq did not answer within ${env.groqTimeoutMs / 1000} seconds.`;
  }
  if (status >= 500) return `Groq had a server error (${status}).`;
  return "Couldn't reach Groq. Check your internet connection or firewall.";
}

async function extractNode(state) {
  try {
    const rawFilters = await extractFilters(state.query, {
      signal: AbortSignal.timeout(env.groqTimeoutMs),
    });
    return { rawFilters };
  } catch (err) {
    console.error('[search] LLM extraction failed:', err?.message ?? err);
    return {
      rawFilters: null,
      aiUsed: false,
      warning: `AI search is unavailable. ${explainLlmError(err)} Showing all listings.`,
    };
  }
}

function validateNode(state) {
  const filters = sanitizeFilters(state.rawFilters);
  if (Object.keys(filters).length === 0) {
    return {
      filters: {},
      aiUsed: false,
      warning: "Couldn't find any search criteria in that query, showing all listings.",
    };
  }
  return { filters, aiUsed: true };
}

function searchNode(state) {
  return { listings: applyFilters(getAllListings(), state.filters) };
}

const workflow = new StateGraph(SearchState)
  .addNode('extract', extractNode)
  .addNode('validate', validateNode)
  .addNode('search', searchNode)
  .addEdge(START, 'extract')
  .addConditionalEdges('extract', (state) =>
    state.rawFilters ? 'validate' : 'search',
  )
  .addEdge('validate', 'search')
  .addEdge('search', END);

export const searchGraph = workflow.compile();

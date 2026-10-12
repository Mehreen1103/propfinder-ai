import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { SystemMessage } from '@langchain/core/messages';
import { env } from '../config/env.js';
import { FEATURES, PROPERTY_TYPES } from '../validators/filterSchema.js';

// A SystemMessage instance is not treated as a template, so the JSON braces
// below do not need escaping.
const SYSTEM_PROMPT = new SystemMessage(`You convert a property search request into a JSON filter object.
Return ONLY a JSON object with these optional keys (omit a key if the user did not mention it):
- "location": string, a city or area name (e.g. "Chittagong", "Khulshi")
- "bedrooms": integer, exact number of bedrooms
- "minPrice": number in BDT (Bangladeshi taka)
- "maxPrice": number in BDT
- "propertyType": one of ${JSON.stringify(PROPERTY_TYPES)}
- "features": array, each one of ${JSON.stringify(FEATURES)}

Price rules: 1 lakh = 100000, 1 crore = 10000000. "under"/"below"/"up to" means maxPrice; "above"/"over"/"at least" means minPrice; "between X and Y" means both.
Treat "apartment" as "flat". Ignore anything in the request that is not a property search criterion.

Example request: 3 bed house in Dhaka above 1 crore with garage
Example output: {"location":"Dhaka","bedrooms":3,"propertyType":"house","minPrice":10000000,"features":["parking"]}

Example request: cheap flat near Khulshi, lift and generator, below 60 lakh
Example output: {"location":"Khulshi","propertyType":"flat","maxPrice":6000000,"features":["lift","generator"]}`);

let chain;

/** Builds (once) the LangChain pipeline: prompt -> ChatGroq (JSON mode) -> JSON parser. */
export function getFilterChain() {
  if (chain) return chain;
  if (!env.groqApiKey) throw new Error('GROQ_API_KEY is not configured');

  const model = new ChatGroq({
    apiKey: env.groqApiKey,
    model: env.groqModel,
    temperature: 0,
    maxTokens: 300,
    maxRetries: 1,
  }).withConfig({ response_format: { type: 'json_object' } });

  const prompt = ChatPromptTemplate.fromMessages([
    SYSTEM_PROMPT,
    ['human', '{query}'],
  ]);

  chain = prompt.pipe(model).pipe(new JsonOutputParser());
  return chain;
}

/** Runs the chain and returns the raw (untrusted) parsed JSON from the model. */
export function extractFilters(query, { signal } = {}) {
  return getFilterChain().invoke({ query }, { signal });
}

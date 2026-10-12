import { searchBodySchema } from '../validators/filterSchema.js';
import { searchWithNaturalLanguage } from '../services/nlSearch.service.js';

export async function aiSearch(req, res) {
  const parsed = searchBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' });
  }
  const result = await searchWithNaturalLanguage(parsed.data.query);
  res.json(result);
}

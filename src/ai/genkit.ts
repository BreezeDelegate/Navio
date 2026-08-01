import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export function createGeminiAI(apiKey?: string) {
  return genkit({
    plugins: [googleAI(apiKey ? { apiKey } : undefined)],
    model: googleAI.model('gemini-2.5-flash'),
  });
}

// Kept for the Genkit development runtime. Production generation creates a
// request-scoped client so a visitor-provided key is never shared globally.
export const ai = createGeminiAI();

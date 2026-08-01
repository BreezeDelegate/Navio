'use server';

import { z } from 'zod';
import {
  generateBotSpecificationFromPrompt,
  type GenerateBotSpecificationOutput,
} from '@/ai/flows/generate-bot-specification-from-prompt';
import {
  validateSpecification,
  type SpecificationValidation,
} from '@/lib/specification-validation';

export interface ForgeState {
  spec: GenerateBotSpecificationOutput | null;
  validation: SpecificationValidation | null;
  error: string | null;
  key: number;
}

const briefSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, 'Describe the idea in at least 20 characters.')
    .max(4000, 'Keep the main idea under 4,000 characters.'),
  audience: z.string().trim().max(1000).optional(),
  inputs: z.string().trim().max(1500).optional(),
  actions: z.string().trim().max(1500).optional(),
  constraints: z.string().trim().max(1500).optional(),
});

function readField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

function buildBrief(data: z.infer<typeof briefSchema>) {
  return [
    `Idea\n${data.prompt}`,
    data.audience && `Target users\n${data.audience}`,
    data.inputs && `Available data and events\n${data.inputs}`,
    data.actions && `Expected actions and results\n${data.actions}`,
    data.constraints && `Constraints and boundaries\n${data.constraints}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function generateSpecificationAction(
  previousState: ForgeState,
  formData: FormData
): Promise<ForgeState> {
  const parsed = briefSchema.safeParse({
    prompt: readField(formData, 'prompt'),
    audience: readField(formData, 'audience'),
    inputs: readField(formData, 'inputs'),
    actions: readField(formData, 'actions'),
    constraints: readField(formData, 'constraints'),
  });

  if (!parsed.success) {
    return {
      spec: null,
      validation: null,
      error: parsed.error.issues[0]?.message ?? 'The brief is not valid.',
      key: previousState.key + 1,
    };
  }

  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    return {
      spec: null,
      validation: null,
      error: 'Set GEMINI_API_KEY in .env.local before generating a specification.',
      key: previousState.key + 1,
    };
  }

  try {
    const spec = await generateBotSpecificationFromPrompt({
      botDescription: buildBrief(parsed.data),
    });
    const validation = validateSpecification(spec);

    return {
      spec,
      validation,
      error: null,
      key: previousState.key + 1,
    };
  } catch (error) {
    console.error('Specification generation failed', error);

    return {
      spec: null,
      validation: null,
      error: 'Generation failed. Check the API key and try again with a more specific brief.',
      key: previousState.key + 1,
    };
  }
}

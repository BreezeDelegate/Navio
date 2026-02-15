
'use server';

import { z } from 'zod';
import {
  generateBotSpecificationFromPrompt,
  type GenerateBotSpecificationOutput,
} from '@/ai/flows/generate-bot-specification-from-prompt';
import {
  validateBotSpecificationCompliance,
  type ValidateBotSpecificationComplianceOutput,
} from '@/ai/flows/validate-bot-specification-compliance-flow';

export interface ForgeState {
  spec: GenerateBotSpecificationOutput | null;
  validation: ValidateBotSpecificationComplianceOutput | null;
  error: string | null;
  key: number;
}

export async function generateSpecificationAction(
  prevState: ForgeState,
  formData: FormData
): Promise<ForgeState> {
  const schema = z.object({
    prompt: z.string().min(20, { message: 'Please provide a more detailed description (at least 20 characters).' }),
  });

  const validatedFields = schema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      spec: null,
      validation: null,
      error: validatedFields.error.flatten().fieldErrors.prompt?.[0] ?? 'Invalid input.',
      key: prevState.key + 1,
    };
  }

  try {
    const spec = await generateBotSpecificationFromPrompt({
      botDescription: validatedFields.data.prompt,
    });

    const validation = await validateBotSpecificationCompliance({
      botSpecification: JSON.stringify(spec, null, 2),
    });

    return { spec, validation, error: null, key: prevState.key + 1 };
  } catch (e) {
    console.error(e);
    // This can happen if the AI model fails to generate a valid JSON structure.
    return {
      spec: null,
      validation: null,
      error: 'The AI model failed to generate a valid specification. Please try refining your prompt or try again.',
      key: prevState.key + 1,
    };
  }
}

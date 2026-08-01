'use server';

import { createGeminiAI } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBotSpecificationInputSchema = z.object({
  botDescription: z.string(),
});

export type GenerateBotSpecificationInput = z.infer<
  typeof GenerateBotSpecificationInputSchema
>;

const InputDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  required: z.boolean(),
});

const OutputDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const IntegrationDefinitionSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  required: z.boolean(),
});

const EnvironmentVariableSchema = z.object({
  name: z.string(),
  description: z.string(),
  required: z.boolean(),
});

const GenerateBotSpecificationOutputSchema = z.object({
  version: z.string(),
  botName: z.string(),
  botPurpose: z.string(),
  targetUsers: z.array(z.string()).min(1),
  assumptions: z.array(z.string()),
  museCapability: z.string(),
  callCapability: z.string(),
  triggers: z.array(z.string()).min(1),
  inputs: z.array(InputDefinitionSchema).min(1),
  outputs: z.array(OutputDefinitionSchema).min(1),
  integrations: z.array(IntegrationDefinitionSchema),
  environmentVariables: z.array(EnvironmentVariableSchema),
  setupSteps: z.array(z.string()).min(3),
  acceptanceCriteria: z.array(z.string()).min(2),
  outOfScope: z.array(z.string()),
  standardAdherence: z.object({
    standardId: z.literal('44-36'),
    moduleType: z.string(),
    dataInputFormat: z.string(),
    dataOutputFormat: z.string(),
    interactionProtocols: z.array(z.string()).min(1),
    securityConsiderations: z.array(z.string()).min(1),
    performanceMetrics: z.array(z.string()).min(1),
  }),
});

export type GenerateBotSpecificationOutput = z.infer<
  typeof GenerateBotSpecificationOutputSchema
>;

export async function generateBotSpecificationFromPrompt(
  input: GenerateBotSpecificationInput,
  apiKey?: string
): Promise<GenerateBotSpecificationOutput> {
  const ai = createGeminiAI(apiKey);
  const { output } = await ai.generate({
    output: { schema: GenerateBotSpecificationOutputSchema },
    prompt: `Turn the brief below into an implementation-ready bot specification using Navio's 44-36 format.

Use version 1.0.0. Keep the proposal realistic for a small team. Do not invent existing integrations, credentials, APIs, datasets, or infrastructure. Put uncertain details in assumptions. Environment variable names must use uppercase snake case. Setup steps must be ordered and actionable. Acceptance criteria must be observable and testable. Performance metrics must include a measurable target. Out-of-scope items should prevent the first version from growing without limits.

The muse capability explains what the bot observes or processes. The call capability explains what it does or changes. Inputs describe incoming data. Outputs describe results visible to users or other systems.

Brief:
"""${input.botDescription}"""`,
  });

  if (!output) {
    throw new Error('No specification was returned.');
  }

  return output;
}

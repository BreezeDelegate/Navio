'use server';
/**
 * @fileOverview A Genkit flow for generating detailed bot specifications from natural language descriptions.
 *
 * - generateBotSpecificationFromPrompt - A function that orchestrates the generation of a bot specification.
 * - GenerateBotSpecificationInput - The input type for the generateBotSpecificationFromPrompt function.
 * - GenerateBotSpecificationOutput - The return type for the generateBotSpecificationFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBotSpecificationInputSchema = z.object({
  botDescription: z
    .string()
    .describe(
      "A natural language description of the desired 'muse&call' bot functionality."
    ),
});
export type GenerateBotSpecificationInput = z.infer<
  typeof GenerateBotSpecificationInputSchema
>;

const GenerateBotSpecificationOutputSchema = z.object({
  botName: z.string().describe('A concise name for the bot.'),
  botPurpose: z
    .string()
    .describe('A detailed explanation of the bot\'s primary purpose and goals.'),
  museCapability: z
    .string()
    .describe('Describes what information or data the bot observes, processes, or "muses" on.'),
  callCapability: z
    .string()
    .describe('Describes what actions or operations the bot can initiate or "call" externally.'),
  standardAdherence: z
    .object({
      standardId: z
        .literal('44-36')
        .describe('The identifier for the structural standard.'),
      moduleType: z
        .string()
        .describe('The type of module, e.g., "muse&call bot module".'),
      dataInputFormat: z
        .string()
        .describe('The expected data format for input (e.g., JSON, XML, plain text).'),
      dataOutputFormat: z
        .string()
        .describe('The data format for output (e.g., JSON, XML, plain text).'),
      interactionProtocols: z
        .array(z.string())
        .describe('List of communication protocols used for interaction (e.g., REST, gRPC, Message Queue).'),
      securityConsiderations: z
        .array(z.string())
        .describe('Key security aspects and considerations for the module.'),
      performanceMetrics: z
        .array(z.string())
        .describe('Expected performance indicators and metrics.'),
    })
    .describe('Details on the bot\'s adherence to the 44-36 structural standard.'),
});
export type GenerateBotSpecificationOutput = z.infer<
  typeof GenerateBotSpecificationOutputSchema
>;

export async function generateBotSpecificationFromPrompt(
  input: GenerateBotSpecificationInput
): Promise<GenerateBotSpecificationOutput> {
  return generateBotSpecificationFromPromptFlow(input);
}

const botSpecificationPrompt = ai.definePrompt({
  name: 'botSpecificationPrompt',
  input: { schema: GenerateBotSpecificationInputSchema },
  output: { schema: GenerateBotSpecificationOutputSchema },
  prompt: `You are an expert AI system architect specializing in 'muse&call' bot design and the '44-36' structural standard for new AI-built modules.

Your task is to convert a natural language description of a desired 'muse&call' bot into a detailed, structured bot specification that strictly adheres to the '44-36' standard.

The '44-36' standard requires defining:
-   A clear bot name.
-   A comprehensive bot purpose.
-   What data or information the bot will 'muse' on (Muse Capability).
-   What actions or functions the bot can 'call' or execute (Call Capability).
-   Specific technical details regarding its integration and operation.

Ensure that the output is a JSON object matching the provided schema, with all fields populated accurately based on the user's description. If any information is not explicitly provided, make reasonable assumptions to complete the specification, ensuring it still makes sense within the '44-36' context.

User's desired bot description:
"""{{{botDescription}}}"""`,
});

const generateBotSpecificationFromPromptFlow = ai.defineFlow(
  {
    name: 'generateBotSpecificationFromPromptFlow',
    inputSchema: GenerateBotSpecificationInputSchema,
    outputSchema: GenerateBotSpecificationOutputSchema,
  },
  async (input) => {
    const { output } = await botSpecificationPrompt(input);
    return output!;
  }
);

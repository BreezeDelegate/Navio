'use server';
/**
 * @fileOverview This file implements a Genkit flow for validating bot specifications against the '44-36' standard.
 *
 * - validateBotSpecificationCompliance - A function that checks a bot specification for compliance.
 * - ValidateBotSpecificationComplianceInput - The input type for the validateBotSpecificationCompliance function.
 * - ValidateBotSpecificationComplianceOutput - The return type for the validateBotSpecificationCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateBotSpecificationComplianceInputSchema = z.object({
  botSpecification: z
    .string()
    .describe(
      'The detailed specification of an AI bot, usually generated in a structured format like JSON or YAML.'
    ),
});
export type ValidateBotSpecificationComplianceInput = z.infer<
  typeof ValidateBotSpecificationComplianceInputSchema
>;

const ValidateBotSpecificationComplianceOutputSchema = z.object({
  isCompliant: z
    .boolean()
    .describe('True if the bot specification complies with the 44-36 standard, false otherwise.'),
  feedback: z
    .string()
    .describe('Detailed feedback on the compliance check, explaining any issues or confirming compliance.'),
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to bring the specification into compliance, if not already compliant. Empty if compliant.'),
});
export type ValidateBotSpecificationComplianceOutput = z.infer<
  typeof ValidateBotSpecificationComplianceOutputSchema
>;

export async function validateBotSpecificationCompliance(
  input: ValidateBotSpecificationComplianceInput
): Promise<ValidateBotSpecificationComplianceOutput> {
  return validateBotSpecificationComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateBotSpecificationCompliancePrompt',
  input: {schema: ValidateBotSpecificationComplianceInputSchema},
  output: {schema: ValidateBotSpecificationComplianceOutputSchema},
  prompt: `You are an expert in AI bot specification design and compliance, specifically with the '44-36' standard for new AI-built modules.
The '44-36' standard dictates that a bot specification for a 'muse&call' bot built by AI must include:
1.  A clear 'name' for the bot.
2.  A 'purpose' or 'description' explaining its function.
3.  Defined 'muse' (input/trigger) mechanisms, detailing how the bot receives information or is activated.
4.  Defined 'call' (output/action) mechanisms, detailing how the bot performs actions or provides output.
5.  A section for 'interaction_protocols' with other modules, describing data formats, APIs, or communication methods.
6.  A section for 'security_considerations', covering data handling, access control, and potential vulnerabilities.
7.  A 'version' identifier, indicating the specification version.
8.  It must be formatted in a structured, parseable format (e.g., JSON or YAML, preferably JSON).

Given the following bot specification, evaluate its compliance with the '44-36' standard.
If it is compliant, set 'isCompliant' to 'true' and provide positive 'feedback'. The 'suggestions' array should be empty.
If it is not compliant, set 'isCompliant' to 'false', explain the reasons in 'feedback', and provide concrete 'suggestions' for how to adjust the specification to meet the standard.

Bot Specification:
{{{botSpecification}}}`,
});

const validateBotSpecificationComplianceFlow = ai.defineFlow(
  {
    name: 'validateBotSpecificationComplianceFlow',
    inputSchema: ValidateBotSpecificationComplianceInputSchema,
    outputSchema: ValidateBotSpecificationComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

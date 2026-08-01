import type { GenerateBotSpecificationOutput } from '@/ai/flows/generate-bot-specification-from-prompt';

export type SpecificationValidation = {
  isCompliant: boolean;
  feedback: string;
  suggestions: string[];
};

export function validateSpecification(
  spec: GenerateBotSpecificationOutput
): SpecificationValidation {
  const suggestions: string[] = [];

  if (!/^\d+\.\d+\.\d+$/.test(spec.version)) {
    suggestions.push('Use a semantic version such as 1.0.0.');
  }

  if (spec.standardAdherence.standardId !== '44-36') {
    suggestions.push('Set the format identifier to 44-36.');
  }

  if (spec.targetUsers.length === 0) {
    suggestions.push('Name at least one target user.');
  }

  if (spec.triggers.length === 0) {
    suggestions.push('Define at least one trigger.');
  }

  if (spec.inputs.length === 0) {
    suggestions.push('Define the data or events the bot receives.');
  }

  if (spec.outputs.length === 0) {
    suggestions.push('Define at least one observable result.');
  }

  if (spec.setupSteps.length < 3) {
    suggestions.push('Provide at least three setup steps.');
  }

  if (spec.acceptanceCriteria.length < 2) {
    suggestions.push('Add at least two testable acceptance criteria.');
  }

  if (spec.standardAdherence.securityConsiderations.length === 0) {
    suggestions.push('Document at least one security consideration.');
  }

  if (spec.standardAdherence.performanceMetrics.length === 0) {
    suggestions.push('Document at least one measurable performance target.');
  }

  return {
    isCompliant: suggestions.length === 0,
    feedback:
      suggestions.length === 0
        ? 'The specification is complete enough to hand to an implementation team.'
        : `The specification needs ${suggestions.length} correction${suggestions.length === 1 ? '' : 's'} before implementation.`,
    suggestions,
  };
}

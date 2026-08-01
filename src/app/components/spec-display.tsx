'use client';

import type { GenerateBotSpecificationOutput } from '@/ai/flows/generate-bot-specification-from-prompt';
import type { SpecificationValidation } from '@/lib/specification-validation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Bot,
  CheckCircle2,
  Code,
  Database,
  Download,
  FileOutput,
  Info,
  KeyRound,
  ListChecks,
  MessageSquareQuote,
  Plug,
  Shield,
  Spline,
  Users,
  Wrench,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SpecDisplayProps {
  spec: GenerateBotSpecificationOutput;
  validation: SpecificationValidation;
}

const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}> = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-4">
    <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
    <div className="min-w-0">
      <p className="font-semibold text-foreground">{label}</p>
      <div className="mt-1 text-muted-foreground">{children}</div>
    </div>
  </div>
);

function fileNameFor(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'bot-specification';
}

function download(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function list(title: string, items: string[]) {
  return [
    `## ${title}`,
    '',
    ...(items.length > 0 ? items.map((item) => `- ${item}`) : ['- None']),
    '',
  ];
}

function toMarkdown(
  spec: GenerateBotSpecificationOutput,
  validation: SpecificationValidation
) {
  const lines = [
    `# ${spec.botName}`,
    '',
    `Version: ${spec.version}`,
    '',
    spec.botPurpose,
    '',
    ...list('Target users', spec.targetUsers),
    ...list('Assumptions', spec.assumptions),
    '## Muse capability',
    '',
    spec.museCapability,
    '',
    '## Call capability',
    '',
    spec.callCapability,
    '',
    ...list('Triggers', spec.triggers),
    '## Inputs',
    '',
    ...spec.inputs.map(
      (item) =>
        `- **${item.name}**${item.required ? ' (required)' : ''}: ${item.description}`
    ),
    '',
    '## Outputs',
    '',
    ...spec.outputs.map((item) => `- **${item.name}**: ${item.description}`),
    '',
    '## Integrations',
    '',
    ...(spec.integrations.length > 0
      ? spec.integrations.map(
          (item) =>
            `- **${item.name}**${item.required ? ' (required)' : ''}: ${item.purpose}`
        )
      : ['- None']),
    '',
    '## Environment variables',
    '',
    ...(spec.environmentVariables.length > 0
      ? spec.environmentVariables.map(
          (item) =>
            `- \`${item.name}\`${item.required ? ' (required)' : ''}: ${item.description}`
        )
      : ['- None']),
    '',
    '## Setup',
    '',
    ...spec.setupSteps.map((item, index) => `${index + 1}. ${item}`),
    '',
    ...list('Acceptance criteria', spec.acceptanceCriteria),
    ...list('Out of scope', spec.outOfScope),
    '## 44-36 format',
    '',
    `- Module type: ${spec.standardAdherence.moduleType}`,
    `- Input format: ${spec.standardAdherence.dataInputFormat}`,
    `- Output format: ${spec.standardAdherence.dataOutputFormat}`,
    '',
    ...list('Interaction protocols', spec.standardAdherence.interactionProtocols),
    ...list('Security considerations', spec.standardAdherence.securityConsiderations),
    ...list('Performance metrics', spec.standardAdherence.performanceMetrics),
    '## Specification check',
    '',
    validation.feedback,
    '',
  ];

  if (validation.suggestions.length > 0) {
    lines.push(...list('Corrections', validation.suggestions));
  }

  return lines.join('\n');
}

export function SpecDisplay({ spec, validation }: SpecDisplayProps) {
  const baseName = fileNameFor(spec.botName);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            download(
              JSON.stringify({ spec, validation }, null, 2),
              `${baseName}.json`,
              'application/json'
            )
          }
        >
          <Download className="h-4 w-4" />
          JSON
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            download(toMarkdown(spec, validation), `${baseName}.md`, 'text/markdown')
          }
        >
          <Download className="h-4 w-4" />
          Markdown
        </Button>
      </div>

      <Alert variant={validation.isCompliant ? 'default' : 'destructive'}>
        {validation.isCompliant ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        <AlertTitle>Specification check</AlertTitle>
        <AlertDescription>{validation.feedback}</AlertDescription>
        {validation.suggestions.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {validation.suggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        )}
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                <Bot className="h-6 w-6 text-primary" />
                {spec.botName}
              </CardTitle>
              <CardDescription className="mt-2 max-w-3xl text-base">
                {spec.botPurpose}
              </CardDescription>
            </div>
            <Badge variant="secondary">v{spec.version}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <DetailItem icon={Users} label="Target users">
            <div className="flex flex-wrap gap-2">
              {spec.targetUsers.map((user) => (
                <Badge key={user} variant="outline">
                  {user}
                </Badge>
              ))}
            </div>
          </DetailItem>
          {spec.assumptions.length > 0 && (
            <DetailItem icon={Info} label="Assumptions">
              <ul className="list-disc space-y-1 pl-5">
                {spec.assumptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailItem>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <DetailItem icon={MessageSquareQuote} label="Muse capability">
              <p>{spec.museCapability}</p>
            </DetailItem>
            <DetailItem icon={Spline} label="Call capability">
              <p>{spec.callCapability}</p>
            </DetailItem>
          </div>
          <Separator />
          <DetailItem icon={Zap} label="Triggers">
            <ul className="list-disc space-y-1 pl-5">
              {spec.triggers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailItem>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spec.inputs.map((item) => (
              <div key={item.name} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{item.name}</p>
                  {item.required && <Badge variant="secondary">Required</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileOutput className="h-5 w-5 text-primary" />
              Outputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spec.outputs.map((item) => (
              <div key={item.name} className="rounded-lg border p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Implementation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <DetailItem icon={Plug} label="Integrations">
              {spec.integrations.length > 0 ? (
                <ul className="space-y-3">
                  {spec.integrations.map((item) => (
                    <li key={item.name}>
                      <span className="font-medium text-foreground">{item.name}</span>
                      {item.required && <span> · required</span>}
                      <p className="text-sm">{item.purpose}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>None required for the first version.</p>
              )}
            </DetailItem>
            <DetailItem icon={KeyRound} label="Environment variables">
              {spec.environmentVariables.length > 0 ? (
                <ul className="space-y-3">
                  {spec.environmentVariables.map((item) => (
                    <li key={item.name}>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
                        {item.name}
                      </code>
                      {item.required && <span> · required</span>}
                      <p className="mt-1 text-sm">{item.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No environment variables required.</p>
              )}
            </DetailItem>
          </div>
          <Separator />
          <DetailItem icon={ListChecks} label="Setup steps">
            <ol className="list-decimal space-y-2 pl-5">
              {spec.setupSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </DetailItem>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Definition of done</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {spec.acceptanceCriteria.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Out of scope</CardTitle>
          </CardHeader>
          <CardContent>
            {spec.outOfScope.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                {spec.outOfScope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No exclusions were defined.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Navio 44-36 format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Module</p>
              <p className="text-sm text-muted-foreground">{spec.standardAdherence.moduleType}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Input format</p>
              <p className="text-sm text-muted-foreground">{spec.standardAdherence.dataInputFormat}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Output format</p>
              <p className="text-sm text-muted-foreground">{spec.standardAdherence.dataOutputFormat}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Format ID</p>
              <p className="text-sm text-muted-foreground">{spec.standardAdherence.standardId}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-6 md:grid-cols-3">
            <DetailItem icon={Spline} label="Protocols">
              <ul className="list-disc space-y-1 pl-5">
                {spec.standardAdherence.interactionProtocols.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailItem>
            <DetailItem icon={Shield} label="Security">
              <ul className="list-disc space-y-1 pl-5">
                {spec.standardAdherence.securityConsiderations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailItem>
            <DetailItem icon={Activity} label="Performance">
              <ul className="list-disc space-y-1 pl-5">
                {spec.standardAdherence.performanceMetrics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailItem>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="raw-json">
          <AccordionTrigger>Raw JSON</AccordionTrigger>
          <AccordionContent>
            <pre className="overflow-x-auto rounded-md bg-black/50 p-4 text-sm text-white">
              <code>{JSON.stringify(spec, null, 2)}</code>
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

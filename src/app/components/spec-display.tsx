'use client';

import type { GenerateBotSpecificationOutput } from '@/ai/flows/generate-bot-specification-from-prompt';
import type { ValidateBotSpecificationComplianceOutput } from '@/ai/flows/validate-bot-specification-compliance-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, Bot, CheckCircle2, Code, Download, Info, MessageSquareQuote, Shield, Spline, XCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SpecDisplayProps {
  spec: GenerateBotSpecificationOutput;
  validation: ValidateBotSpecificationComplianceOutput;
}

const DetailItem: React.FC<{
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}> = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-4">
    <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
    <div>
      <p className="font-semibold text-foreground">{label}</p>
      <div className="text-muted-foreground">{children}</div>
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

function toMarkdown(
  spec: GenerateBotSpecificationOutput,
  validation: ValidateBotSpecificationComplianceOutput
) {
  const lines = [
    `# ${spec.botName}`,
    '',
    spec.botPurpose,
    '',
    '## Muse capability',
    '',
    spec.museCapability,
    '',
    '## Call capability',
    '',
    spec.callCapability,
    '',
    '## 44-36 standard',
    '',
    `- Module type: ${spec.standardAdherence.moduleType}`,
    `- Standard ID: ${spec.standardAdherence.standardId}`,
    `- Input format: ${spec.standardAdherence.dataInputFormat}`,
    `- Output format: ${spec.standardAdherence.dataOutputFormat}`,
    '',
    '### Interaction protocols',
    '',
    ...spec.standardAdherence.interactionProtocols.map((item) => `- ${item}`),
    '',
    '### Security considerations',
    '',
    ...spec.standardAdherence.securityConsiderations.map((item) => `- ${item}`),
    '',
    '### Performance metrics',
    '',
    ...spec.standardAdherence.performanceMetrics.map((item) => `- ${item}`),
    '',
    '## Compliance check',
    '',
    validation.isCompliant ? 'Compliant' : 'Not compliant',
    '',
    validation.feedback,
  ];

  if (validation.suggestions.length > 0) {
    lines.push('', '### Suggestions', '');
    lines.push(...validation.suggestions.map((item) => `- ${item}`));
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
          <Download className="mr-2 h-4 w-4" />
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
          <Download className="mr-2 h-4 w-4" />
          Markdown
        </Button>
      </div>

      <Alert variant={validation.isCompliant ? 'default' : 'destructive'}>
        {validation.isCompliant ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        <AlertTitle>44-36 Standard Compliance Check</AlertTitle>
        <AlertDescription>{validation.feedback}</AlertDescription>
        {!validation.isCompliant && validation.suggestions.length > 0 && (
          <div className="mt-2 text-sm">
            <p className="font-semibold">Suggestions:</p>
            <ul className="list-disc pl-5">
              {validation.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl">
            <Bot className="h-6 w-6 text-accent" />
            {spec.botName}
          </CardTitle>
          <CardDescription>{spec.botPurpose}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="grid gap-6 md:grid-cols-2">
            <DetailItem icon={MessageSquareQuote} label="Muse Capability">
              <p>{spec.museCapability}</p>
            </DetailItem>
            <DetailItem icon={Spline} label="Call Capability">
              <p>{spec.callCapability}</p>
            </DetailItem>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            Standard Adherence Details (44-36)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem icon={Code} label="Module Type">
              <Badge variant="secondary">{spec.standardAdherence.moduleType}</Badge>
            </DetailItem>
            <DetailItem icon={Code} label="Standard ID">
              <Badge variant="secondary">{spec.standardAdherence.standardId}</Badge>
            </DetailItem>
            <DetailItem icon={Code} label="Input Format">
              <Badge variant="secondary">{spec.standardAdherence.dataInputFormat}</Badge>
            </DetailItem>
            <DetailItem icon={Code} label="Output Format">
              <Badge variant="secondary">{spec.standardAdherence.dataOutputFormat}</Badge>
            </DetailItem>
          </div>
          <Separator />
          <DetailItem icon={Spline} label="Interaction Protocols">
            <div className="flex flex-wrap gap-2">
              {spec.standardAdherence.interactionProtocols.map((protocol) => (
                <Badge key={protocol} variant="outline">
                  {protocol}
                </Badge>
              ))}
            </div>
          </DetailItem>
          <Separator />
          <DetailItem icon={Shield} label="Security Considerations">
            <ul className="list-disc space-y-1 pl-4">
              {spec.standardAdherence.securityConsiderations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailItem>
          <Separator />
          <DetailItem icon={Activity} label="Performance Metrics">
            <ul className="list-disc space-y-1 pl-4">
              {spec.standardAdherence.performanceMetrics.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailItem>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="raw-json">
          <AccordionTrigger>View Raw JSON Specification</AccordionTrigger>
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

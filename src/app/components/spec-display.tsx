'use client';

import type { GenerateBotSpecificationOutput } from '@/ai/flows/generate-bot-specification-from-prompt';
import type { ValidateBotSpecificationComplianceOutput } from '@/ai/flows/validate-bot-specification-compliance-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Bot, Code, Info, Shield, Spline, Activity, MessageSquareQuote } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SpecDisplayProps {
  spec: GenerateBotSpecificationOutput;
  validation: ValidateBotSpecificationComplianceOutput;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 shrink-0 mt-1 text-primary" />
        <div>
            <p className="font-semibold text-foreground">{label}</p>
            <div className="text-muted-foreground">{children}</div>
        </div>
    </div>
);


export function SpecDisplay({ spec, validation }: SpecDisplayProps) {
  return (
    <div className="space-y-6">
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
                    {validation.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
        )}
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl">
            <Bot className="h-6 w-6 text-accent"/> {spec.botName}
          </CardTitle>
          <CardDescription>{spec.botPurpose}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="grid md:grid-cols-2 gap-6">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
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
                {spec.standardAdherence.interactionProtocols.map(p => <Badge key={p} variant="outline">{p}</Badge>)}
              </div>
            </DetailItem>
           <Separator />
            <DetailItem icon={Shield} label="Security Considerations">
              <ul className="list-disc space-y-1 pl-4">
                {spec.standardAdherence.securityConsiderations.map(s => <li key={s}>{s}</li>)}
              </ul>
            </DetailItem>
           <Separator />
            <DetailItem icon={Activity} label="Performance Metrics">
              <ul className="list-disc space-y-1 pl-4">
                {spec.standardAdherence.performanceMetrics.map(m => <li key={m}>{m}</li>)}
              </ul>
            </DetailItem>
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>View Raw JSON Specification</AccordionTrigger>
          <AccordionContent>
            <pre className="p-4 bg-black/50 rounded-md text-sm overflow-x-auto text-white">
                <code>{JSON.stringify(spec, null, 2)}</code>
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateSpecificationAction, type ForgeState } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Loader2, Sparkles, Terminal } from 'lucide-react';
import { SpecDisplay } from './spec-display';
import { SpecSkeleton } from './spec-skeletons';

const initialState: ForgeState = {
  spec: null,
  validation: null,
  error: null,
  key: 0,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Specification
        </>
      )}
    </Button>
  );
}

export function Forge() {
  const [state, formAction] = useFormState(
    generateSpecificationAction,
    initialState
  );
  const { pending } = useFormStatus();

  return (
    <div className="container mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <form action={formAction} className="space-y-4">
        <h2 className="font-headline text-2xl text-foreground/90">
          1. Describe Your Bot
        </h2>
        <Textarea
          name="prompt"
          placeholder="e.g., 'An AI bot that monitors real-time stock market data for unusual trading volumes and sends alerts to a Slack channel. It should be able to fetch historical price data on command.'"
          className="min-h-[120px] text-base"
          required
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-sm text-muted-foreground">
                Describe the bot's purpose, what it should observe ('muse'), and what it should do ('call').
            </p>
            <SubmitButton />
        </div>
      </form>

      {state.error && (
        <Alert variant="destructive" className="animate-in fade-in-50">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Generation Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="font-headline text-2xl text-foreground/90">
          2. Generated Specification
        </h2>
        
        {pending && <SpecSkeleton />}
        
        {!pending && state.spec && state.validation && (
            <div key={state.key} className="animate-in fade-in-50 duration-500">
                <SpecDisplay spec={state.spec} validation={state.validation} />
            </div>
        )}

        {!pending && !state.spec && !state.error && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">Awaiting Your Vision</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Your generated bot specification will appear here once you provide a description.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}

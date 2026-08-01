'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateSpecificationAction, type ForgeState } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, History, Loader2, Sparkles, Terminal, Trash2 } from 'lucide-react';
import { SpecDisplay } from './spec-display';
import { SpecSkeleton } from './spec-skeletons';

const HISTORY_KEY = 'navio_spec_history';
const HISTORY_LIMIT = 8;

const initialState: ForgeState = {
  spec: null,
  validation: null,
  error: null,
  key: 0,
};

type SavedSpecification = {
  id: string;
  createdAt: string;
  spec: NonNullable<ForgeState['spec']>;
  validation: NonNullable<ForgeState['validation']>;
};

function readHistory(): SavedSpecification[] {
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
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
  const [state, formAction, pending] = useActionState(
    generateSpecificationAction,
    initialState
  );
  const [history, setHistory] = useState<SavedSpecification[]>([]);
  const [selected, setSelected] = useState<SavedSpecification | null>(null);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  useEffect(() => {
    if (!state.spec || !state.validation || state.key === 0) {
      return;
    }

    const entry: SavedSpecification = {
      id: `${Date.now()}-${state.key}`,
      createdAt: new Date().toISOString(),
      spec: state.spec,
      validation: state.validation,
    };
    const serializedSpec = JSON.stringify(state.spec);

    setHistory((current) => {
      const next = [
        entry,
        ...current.filter((item) => JSON.stringify(item.spec) !== serializedSpec),
      ].slice(0, HISTORY_LIMIT);

      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
    setSelected(null);
  }, [state.key, state.spec, state.validation]);

  const clearHistory = () => {
    window.localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    setSelected(null);
  };

  const activeSpec = selected?.spec ?? state.spec;
  const activeValidation = selected?.validation ?? state.validation;

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
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
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

      {history.length > 0 && (
        <section className="space-y-3 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <History className="h-4 w-4" />
              Recent specifications
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {history.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant={selected?.id === item.id ? 'secondary' : 'ghost'}
                className="h-auto justify-start px-3 py-2 text-left"
                onClick={() => setSelected(item)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.spec.botName}</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-4">
        <h2 className="font-headline text-2xl text-foreground/90">
          2. Generated Specification
        </h2>

        {pending && <SpecSkeleton />}

        {!pending && activeSpec && activeValidation && (
          <div
            key={selected?.id ?? state.key}
            className="animate-in fade-in-50 duration-500"
          >
            <SpecDisplay spec={activeSpec} validation={activeValidation} />
          </div>
        )}

        {!pending && !activeSpec && !state.error && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Awaiting Your Vision
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your generated bot specification will appear here once you provide a description.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

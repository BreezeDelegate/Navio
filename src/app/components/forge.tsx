'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateSpecificationAction, type ForgeState } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, FileText, History, Loader2, Sparkles, Terminal, Trash2 } from 'lucide-react';
import { SpecDisplay } from './spec-display';
import { SpecSkeleton } from './spec-skeletons';

const HISTORY_KEY = 'navio_spec_history';
const HISTORY_LIMIT = 8;

const exampleBrief = {
  prompt:
    'A Discord bot that watches support channels, groups repeated incidents and prepares a concise report for the team without replying publicly.',
  audience: 'Community moderators and the support lead.',
  inputs:
    'Discord messages, channel identifiers, timestamps and a configurable list of incident keywords.',
  actions:
    'Create an incident summary, attach source message links and send the report to a private moderator channel.',
  constraints:
    'Read-only access to public support channels. No automated moderation. Do not store message content longer than seven days.',
};

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

function isSavedSpecification(value: unknown): value is SavedSpecification {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<SavedSpecification>;
  const spec = item.spec as Partial<SavedSpecification['spec']> | undefined;

  return (
    typeof item.id === 'string' &&
    typeof item.createdAt === 'string' &&
    typeof spec?.version === 'string' &&
    typeof spec.botName === 'string' &&
    Array.isArray(spec.targetUsers) &&
    Array.isArray(spec.setupSteps) &&
    Array.isArray(spec.acceptanceCriteria) &&
    !!item.validation &&
    typeof item.validation === 'object'
  );
}

function readHistory(): SavedSpecification[] {
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter(isSavedSpecification).slice(0, HISTORY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate brief
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
  const [prompt, setPrompt] = useState('');
  const [audience, setAudience] = useState('');
  const [inputs, setInputs] = useState('');
  const [actions, setActions] = useState('');
  const [constraints, setConstraints] = useState('');
  const [history, setHistory] = useState<SavedSpecification[]>([]);
  const [historyReady, setHistoryReady] = useState(false);
  const [selected, setSelected] = useState<SavedSpecification | null>(null);

  useEffect(() => {
    setHistory(readHistory());
    setHistoryReady(true);
  }, []);

  useEffect(() => {
    if (!historyReady) {
      return;
    }

    if (history.length === 0) {
      window.localStorage.removeItem(HISTORY_KEY);
      return;
    }

    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history, historyReady]);

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

    setHistory((current) =>
      [
        entry,
        ...current.filter((item) => JSON.stringify(item.spec) !== serializedSpec),
      ].slice(0, HISTORY_LIMIT)
    );
    setSelected(null);
  }, [state.key, state.spec, state.validation]);

  const loadExample = () => {
    setPrompt(exampleBrief.prompt);
    setAudience(exampleBrief.audience);
    setInputs(exampleBrief.inputs);
    setActions(exampleBrief.actions);
    setConstraints(exampleBrief.constraints);
  };

  const clearHistory = () => {
    setHistory([]);
    setSelected(null);
  };

  const activeSpec = selected?.spec ?? state.spec;
  const activeValidation = selected?.validation ?? state.validation;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <section className="rounded-xl border bg-card p-6 md:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <FileText className="h-4 w-4" />
            Idea to implementation brief
          </div>
          <h2 className="font-headline text-3xl font-semibold tracking-tight">
            Turn a rough bot idea into something a developer can build.
          </h2>
          <p className="text-muted-foreground">
            Navio defines the users, triggers, data, actions, integrations, setup and testable completion criteria for a first version.
          </p>
        </div>
      </section>

      <form action={formAction} className="space-y-6 rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-semibold">Describe the product</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only the main idea is required. Extra context makes the result more concrete.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={loadExample}>
            Load example
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">Main idea</Label>
          <Textarea
            id="prompt"
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="What should the bot observe, decide or do?"
            className="min-h-36 text-base"
            required
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="audience">Target users</Label>
            <Textarea
              id="audience"
              name="audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              placeholder="Who uses it and who receives the result?"
              className="min-h-28"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inputs">Available data and events</Label>
            <Textarea
              id="inputs"
              name="inputs"
              value={inputs}
              onChange={(event) => setInputs(event.target.value)}
              placeholder="Messages, files, APIs, schedules, webhooks..."
              className="min-h-28"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actions">Expected actions and results</Label>
            <Textarea
              id="actions"
              name="actions"
              value={actions}
              onChange={(event) => setActions(event.target.value)}
              placeholder="What should happen when the bot runs?"
              className="min-h-28"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="constraints">Constraints and boundaries</Label>
            <Textarea
              id="constraints"
              name="constraints"
              value={constraints}
              onChange={(event) => setConstraints(event.target.value)}
              placeholder="Privacy, budget, platforms, forbidden actions..."
              className="min-h-28"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Generation uses the server-side Gemini key configured by the project owner.
          </p>
          <SubmitButton />
        </div>
      </form>

      {state.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Could not generate the brief</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {history.length > 0 && (
        <section className="space-y-3 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <History className="h-4 w-4" />
              Recent briefs
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">Implementation brief</h2>

        {pending && <SpecSkeleton />}

        {!pending && activeSpec && activeValidation && (
          <div key={selected?.id ?? state.key} className="animate-in fade-in-50 duration-500">
            <SpecDisplay spec={activeSpec} validation={activeValidation} />
          </div>
        )}

        {!pending && !activeSpec && !state.error && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card p-12 text-center">
            <Bot className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No brief generated yet</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Describe the product or load the example to see the full path from idea to an implementation-ready specification.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

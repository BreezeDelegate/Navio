# Navio

Navio turns a rough bot idea into a practical build brief. Describe what the bot should observe and do, then get a structured document covering users, triggers, data, integrations, setup steps, security points and testable completion criteria. Results can be saved in the browser and exported as JSON or Markdown.

## Quick start

You need Node.js 20 or newer and a Gemini API key.

Download or clone the repository, open a terminal in the project folder, then run:

```bash
npm install
npm run setup
npm run dev
```

Paste the Gemini API key when asked, then open `http://localhost:3000`.

A key can be created in Google AI Studio: `https://aistudio.google.com/apikey`.

## Using Navio

1. Describe the main idea.
2. Add any known users, data, actions or limits.
3. Generate the brief.
4. Review the assumptions and implementation plan.
5. Export the result as JSON or Markdown.

The form includes a complete example that can be loaded in one click.

## What the brief contains

- product purpose and target users
- assumptions and scope boundaries
- triggers, inputs, outputs and actions
- external integrations
- required environment variables
- ordered setup steps
- acceptance criteria
- security and performance considerations

Generated briefs and history stay in the user's browser. No account or database is required.

## Manual configuration

Instead of `npm run setup`, copy `.env.example` to `.env.local` and add the key:

```env
GEMINI_API_KEY=your_key_here
```

The key is used on the server and is never requested by the browser.

## Deploy

Navio runs on any platform that supports Next.js. Add `GEMINI_API_KEY` as a server-side environment variable, then use:

```bash
npm run build
npm run start
```

## Checks

```bash
npm run typecheck
npm run build
```

The `44-36` identifier is Navio's internal document format. It is not an external industry standard.

## Stack

Next.js, React, TypeScript, Genkit, Google Gemini, Tailwind CSS and Radix UI.

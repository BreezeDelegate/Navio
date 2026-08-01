# Navio

Navio turns a rough bot idea into a practical build brief. Describe what the bot should observe and do, then get a structured document covering users, triggers, data, integrations, setup steps, security points and testable completion criteria. Briefs stay in the browser and can be exported as JSON or Markdown.

## Run Navio locally

You need:

- Node.js 20 or newer
- a Gemini API key

Create a Gemini key in Google AI Studio: `https://aistudio.google.com/apikey`

### Windows: easiest method

1. Download the repository as a ZIP and extract it.
2. Double-click `start-navio.cmd`.
3. Paste the Gemini key when asked.
4. Navio opens at `http://localhost:3000`.

The launcher installs dependencies on the first run and remembers the configuration for later launches.

### Any platform

Open a terminal in the project folder and run:

```bash
npm install
npm run setup
npm run dev
```

Paste the Gemini key when asked, then open `http://localhost:3000`.

## First use

Navio displays a short three-step guide the first time it opens. The guide can also be reopened with **First steps**.

1. Describe the main idea, or load the complete example.
2. Add known users, data, actions and limits.
3. Generate the brief, review the assumptions and export the result.

Only the main idea is required. Extra context makes the result more specific.

## What Navio generates

Each brief contains:

- product purpose and target users
- assumptions and scope boundaries
- triggers, inputs, outputs and actions
- external integrations
- required environment variables
- ordered setup steps
- acceptance criteria
- security and performance considerations

Recent briefs are stored locally in the browser. No account or database is required.

## Manual configuration

Instead of `npm run setup`, create `.env.local` in the project folder:

```env
GEMINI_API_KEY=your_key_here
```

The key is used only by the local server and is never requested by the browser.

## Common problems

### `node` or `npm` is not recognized

Install Node.js 20 or newer, close the terminal and open it again.

### The generation fails

Check that `.env.local` contains a valid `GEMINI_API_KEY`, then restart Navio.

### Port 3000 is already in use

Stop the other local web server, or run:

```bash
npm run dev -- -p 3001
```

Then open `http://localhost:3001`.

## Deploy

Navio runs on platforms that support Next.js. Add `GEMINI_API_KEY` as a server-side environment variable, then use:

```bash
npm run build
npm run start
```

## Checks

```bash
npm run typecheck
npm run build
```

The `44-36` identifier is Navio's internal document format, not an external industry standard.

## Stack

Next.js, React, TypeScript, Genkit, Google Gemini, Tailwind CSS and Radix UI.

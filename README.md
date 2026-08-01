# Navio

Navio turns a rough bot idea into a practical build brief. Describe what the bot should observe and do, then get a structured document covering users, triggers, data, integrations, setup steps, security points and testable completion criteria. Briefs stay in the browser and can be exported as JSON or Markdown.

## Run Navio locally

You need:

- Node.js 20 or newer
- a Gemini API key, supplied either by the server or in the browser when generating

Create a Gemini key in Google AI Studio: `https://aistudio.google.com/apikey`

### Windows: easiest method

1. Download the repository as a ZIP and extract it.
2. Double-click `start-navio.cmd`.
3. Paste the Gemini key when asked.
4. Navio opens at `http://localhost:3000`.

The launcher installs dependencies on the first run and remembers the local server configuration for later launches.

### Any platform

Open a terminal in the project folder and run:

```bash
npm install
npm run setup
npm run dev
```

Paste the Gemini key when asked, then open `http://localhost:3000`.

You can also skip `npm run setup` and paste a personal key directly in Navio's interface.

## First use

Navio displays a short three-step guide the first time it opens. The guide can also be reopened with **First steps**.

1. Choose the detected server key or paste a personal Gemini key.
2. Describe the main idea, or load the complete example.
3. Add known users, data, actions and limits.
4. Generate the brief, review the assumptions and export the result.

Only the main idea is required. Extra context makes the result more specific.

## Gemini key modes

Navio resolves Gemini credentials in this order:

1. a personal key submitted with the current generation;
2. `GEMINI_API_KEY` on the server;
3. `GOOGLE_API_KEY` on the server;
4. `GOOGLE_GENAI_API_KEY` on the server.

This works with `.env.local`, shell environment variables and deployment platforms such as Netlify, Vercel or other Next.js hosts.

When no server key is detected, the interface asks the visitor for a personal key. When a server key exists, visitors may still choose **Use personal key** to override it for one generation.

Personal keys are handled as follows:

- they are sent only with the generation request;
- they are never added to generated briefs, history or exports;
- they are kept in session storage by default and disappear when the browser session ends;
- **Remember on this device** is optional and stores the key in browser local storage;
- the interface includes a button to forget the key immediately.

Browser storage is not a secret vault: scripts running on the same site origin can access it. Do not enable persistent storage on a shared or untrusted device. For a public deployment, session-only storage is the safer default.

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

## Manual server configuration

Create `.env.local` in the project folder:

```env
GEMINI_API_KEY=your_key_here
```

The same variable can be configured in a hosting provider's environment-variable settings. Restart or redeploy Navio after changing server variables.

## Common problems

### `node` or `npm` is not recognized

Install Node.js 20 or newer, close the terminal and open it again.

### Navio says no Gemini key is available

Paste a personal key in the interface, or configure one of these server variables:

```env
GEMINI_API_KEY=your_key_here
# or GOOGLE_API_KEY
# or GOOGLE_GENAI_API_KEY
```

### The generation fails

Check that the selected Gemini key is valid and allowed to use the configured model, then try again with a more specific brief.

### Port 3000 is already in use

Stop the other local web server, or run:

```bash
npm run dev -- -p 3001
```

Then open `http://localhost:3001`.

## Deploy

Navio runs on platforms that support Next.js. A deployment can either:

- configure a server-side Gemini variable for shared access; or
- leave server variables empty and let each visitor provide a personal key.

Build and start commands:

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

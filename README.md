# Navio

Navio turns a rough bot idea into a build brief that can be handed to a developer.

The generated document defines the users, triggers, inputs, outputs, integrations, environment variables, setup steps, security points and acceptance criteria for a first version. Navio calls Gemini once, then checks the returned structure locally.

## What a user does

1. Describe the main idea.
2. Add any known users, data, actions and constraints.
3. Generate the brief.
4. Review assumptions and implementation details.
5. Export the result as JSON or Markdown.

A complete example can be loaded from the form without writing a prompt from scratch.

## Run locally

Requirements:

- Node.js 20 or newer
- A Gemini API key from Google AI Studio

```bash
npm install
cp .env.example .env.local
```

Add the key to `.env.local`:

```env
GEMINI_API_KEY=your_key_here
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy

The app can run on any platform that supports Next.js. Add `GEMINI_API_KEY` as a server-side environment variable on the hosting platform. The key is never requested from the browser.

Generated briefs and history are stored in the user's browser. No database is required for the current version.

## Output

Each brief contains:

- product purpose and target users
- assumptions and scope boundaries
- Muse and Call capabilities
- triggers, inputs and outputs
- external integrations
- required environment variables
- ordered setup steps
- acceptance criteria
- security and performance considerations

The `44-36` identifier is Navio's internal format for keeping these sections consistent. It is not presented as an external industry standard.

## Scripts

```bash
npm run dev
npm run typecheck
npm run build
npm run genkit:dev
```

## Stack

Next.js, React, TypeScript, Genkit, Google Gemini, Tailwind CSS and Radix UI.

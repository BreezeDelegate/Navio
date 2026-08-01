# Navio

Navio turns a bot idea into a structured Muse & Call specification and checks it against the project's 44-36 format.

## Features

- Generate a bot specification from a plain-text description
- Separate Muse and Call capabilities
- Validate the result against the 44-36 structure
- Reopen recent specifications stored in the browser
- Export a specification as JSON or Markdown

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add a Gemini API key to `.env.local` before starting the app:

```env
GEMINI_API_KEY=your_key_here
```

The development server runs at `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run typecheck
npm run build
npm run genkit:dev
```

## Stack

Next.js, React, TypeScript, Genkit, Google Gemini, Tailwind CSS and Radix UI.

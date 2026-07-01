# OiTutor Nihongo

A Japanese-learning web app built with React, Vite, Tailwind CSS, Supabase, and a small Express API.

## Features

- Interactive hiragana, katakana, kanji, grammar, and dialogue lessons
- JSON-backed lesson content
- Progress tracking with local state and optional Supabase sync
- Authentication-ready frontend via Supabase
- Subscription-ready backend endpoints for Stripe
- Newsletter signup endpoint with optional Cloudflare Turnstile verification

## Tech stack

- Frontend: React 19, Vite 8, Tailwind CSS 4, React Router, react-i18next
- Backend: Node.js, Express, Stripe, Supabase admin client
- Content: lesson JSON files under `src/content/`

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

For the optional API server:

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The frontend expects Supabase values in `.env`. The API expects its own values in `server/.env`. Do not commit real environment files.

## Build

```bash
npm run build
```

## Content validation

```bash
node scripts/validate-dialogues.mjs src/content/dialogues/lesson-{01..49}.json
node scripts/validate-grammar.mjs src/content/grammar/lesson-{01..20}.json
```

## Public-repo hygiene

This repository intentionally excludes private/internal planning docs, deployment notes, local machine settings, logs, build output, dependency folders, and real environment files. Use `.env.example` and `server/.env.example` as templates only.

## License

See `LICENSE`.

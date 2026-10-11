# Ghosted

**Never get ghosted again.**

Log your job applications; it tracks the silence. When it's follow-up day, AI drafts the email.

## How it works

1. Log applications (company, role, date) — or load sample data
2. Pipeline dashboard flags them: Waiting → Follow-up Due (7+ days) → Likely Ghosted (14+ days)
3. Click any flagged card → AI drafts a personalized follow-up email + gives a ghosting score (1-10) with honest verdict
4. Copy, send, mark followed up. Done.

## Tech

- Next.js 16, React 19, TypeScript, Tailwind CSS v4
- shadcn/ui components
- localStorage persistence (your data never leaves the browser)
- FastRouter (OpenAI-compatible) for drafts + ghosting analysis

## Run locally

```bash
npm install
# create .env with FASTROUTER_API_KEY, FASTROUTER_BASE_URL, FASTROUTER_MODEL
npm run dev
```

## Planning docs

- `devpost/scope.md` — what and why
- `devpost/prd.md` — requirements
- `devpost/spec.md` — technical spec

Built for [Build With AI: Basics](https://learn-ai-basics.devpost.com/) using the Learn Skill Pack.

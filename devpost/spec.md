# Ghosted — Spec

## Stack
- Next.js 16.4.0, React 19, TypeScript, Tailwind CSS v4
- localStorage for persistence (no backend)
- FastRouter (OpenAI-compatible) — model `anthropic/claude-opus-4.7`
- Vercel deployment

## Architecture
```
app/page.tsx                        — dashboard (pipeline columns)
app/api/analyze/route.ts            — POST { application } → { draft, ghosting }
lib/llm.ts                          — FastRouter chat client
lib/applications.ts                 — types, timing logic, sample data
components/ApplicationCard.tsx      — card with days-waiting + status flag
components/AddApplication.tsx       — modal form
components/ActionModal.tsx          — AI draft / ghosting assessment display
```

## Data model
```ts
interface Application {
  id: string;
  company: string;
  role: string;
  appliedDate: string; // ISO date
  status: 'waiting' | 'interview' | 'rejected' | 'offer';
  followedUpAt?: string; // ISO date, resets the clock
  notes?: string;
}
```

## Timing engine (lib/applications.ts)
```
daysWaiting = today - max(appliedDate, followedUpAt)
0–7 days   → "waiting"       (normal, no flag)
7–14 days  → "follow-up due" (amber flag)
14+ days   → "likely ghosted" (red flag)
```
Status 'interview'/'rejected'/'offer' bypasses timing (resolved).

## API contract: POST /api/analyze
Request:
```json
{ "company": "Razorpay", "role": "Senior Frontend Dev", "daysWaiting": 12, "notes": "" }
```
Response (200):
```json
{
  "draft": { "subject": "...", "body": "..." },
  "ghosting": { "score": 7, "verdict": "...", "advice": "..." }
}
```
- draft: professional, concise (<120 words), references company + role + wait time. Never desperate.
- ghosting: score 1-10, honest verdict (not false hope), one concrete next step.
- Temperature 0.5 for natural email voice. Fenced-markdown stripped, shape-validated.

## Visual direction
- Dark slate/zinc, amber for "follow-up due", red for "likely ghosted", emerald for positive.
- Pipeline columns (kanban-style) — a familiar, instantly readable pattern.
- No gradients, no AI-purple. Feels like a tool, not a toy.

## Verification
- `npm run build` passes.
- Sample data (7 apps) → correct flags: 3 follow-up due, 2 likely ghosted, 2 waiting.
- Draft endpoint returns valid subject + body for a 12-day application.
- Ghosting endpoint returns score + verdict for a 21-day application.
- localStorage persists across reload.

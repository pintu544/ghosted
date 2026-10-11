# Ghosted — Scope

## One-liner
Log your job applications; it tracks the silence. When it's follow-up day, AI drafts the email.

## Problem
Job seekers send dozens of applications into a black hole. No one tracks which are alive, which are
slow, and which need a follow-up TODAY. The result: opportunities die from neglect, and the anxiety
of "should I follow up or am I being annoying?" paralyzes people.

Existing trackers (spreadsheets, Teal, Huntr) are passive — they store data but never tell you what
to DO. The follow-up email, the hardest part, is left entirely to you.

## Solution
A tracker with a brain:
1. Log applications (company, role, date) — 10 seconds each.
2. The dashboard shows your pipeline with smart timing: Waiting → Follow-up Due (7+ days) → Likely Ghosted (14+ days).
3. Click any application → AI drafts a personalized follow-up email (or a "move on" assessment for ghosted ones).
4. One-tap copy. Send it. Done.

## In scope (PoC)
- Manual application logging (company, role, date applied, status, notes)
- Pipeline dashboard with timing-based flags
- AI follow-up email drafter (personalized per company/role/wait time)
- AI ghosting assessment ("8/10 likely dead — here's why, here's what to do next")
- localStorage persistence (your data stays in your browser)
- Sample data for instant demo

## Out of scope (deliberate cuts)
- Email integration / Gmail reading (auth overhead; manual logging proves the concept)
- Automatic sending (user copies and sends — keeps it safe and simple)
- Interview prep, resume tailoring (separate problems)
- Accounts, cloud sync, mobile app

## Why this can win
- **Real problem, not a visualization.** Pintu has 180+ applications and no system. Every job seeker knows this pain.
- **Not ChatGPT-able.** ChatGPT can't track time across sessions or tap you on the shoulder on follow-up day. The product is the timing engine + proactive nudging, not the text.
- **AI is visible and specific.** It doesn't just "help" — it writes the exact email you'd stare at a blank screen for 20 minutes to produce.
- **60-second demo.** Dashboard with 7 applications → 3 flagged → click → AI draft appears. The "I need this" moment is instant.
- **Innovation.** Existing trackers are dumb storage. None detect ghosting or draft follow-ups. The "ghosting score" is a memorable hook.

## What I learned (to be filled after build)
- The timing thresholds (7/14 days) are the real product insight — the AI is the amplifier.
- Scoping from "email integration" to "manual + AI drafting" was the cut that made it shippable.

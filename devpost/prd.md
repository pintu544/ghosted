# Ghosted — PRD

## Users
Active job seekers (like Pintu: 180+ applications across 4 sites). They've felt the black hole.
They don't need another spreadsheet — they need something that tells them what to do today.

## Core loop
1. **Log** — Add an application: company, role, date applied. 10 seconds. (Or load sample data.)
2. **See** — Dashboard shows pipeline columns: Waiting → Follow-up Due → Likely Ghosted, plus
   Interview / Rejected / Offer for resolved ones. Each card shows days waiting.
3. **Act** — Click a "Follow-up Due" card → AI drafts a personalized email (subject + body,
   referencing the role, company, and wait time). Copy → send → mark as "Followed up."
4. **Move on** — Click a "Likely Ghosted" card → AI gives a ghosting score (1-10), honest
   verdict, and what to do next (follow up once more? move on?).

## Requirements
- P1: Add/edit/delete applications; persisted in localStorage.
- P1: Timing engine: 0–7 days = Waiting, 7–14 = Follow-up Due, 14+ = Likely Ghosted.
  (Thresholds are constants, easy to tune.)
- P1: "Draft follow-up" → AI returns subject + body, personalized, professional, concise.
- P1: "Assess" on ghosted → AI returns score, verdict, and next-step advice.
- P1: Sample data (7 realistic applications) for one-tap demo.
- P1: Copy-to-clipboard on drafts.
- P2: Status transitions (mark as Interview / Rejected / Offer).
- P2: "Followed up" timestamp resets the clock.

## Non-requirements
- No email integration, no auto-send, no accounts, no backend.

## Success criteria (demo)
- Sample data loads → dashboard immediately shows 3 needing attention.
- "Draft follow-up" returns a usable email in under 10 seconds.
- A job seeker watching the demo thinks "I need this tomorrow morning."

## Open questions (resolved)
- Manual logging vs email sync? → Manual. Email auth is a full project; the timing + AI
  drafting is the innovation, not the data ingestion.
- What if someone has 100+ applications? → PoC targets the demo; list virtualization is a
  later problem. localStorage handles dozens fine.

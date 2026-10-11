import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";

const SYSTEM = `You are a job-search coach helping someone follow up on applications. Given an application, return ONLY valid JSON — no markdown, no explanation.

Return this exact shape:
{
  "draft": {
    "subject": "Following up — Senior Frontend Engineer application",
    "body": "Hi team,\\n\\nI applied for the Senior Frontend Engineer role 12 days ago..."
  },
  "ghosting": {
    "score": 7,
    "verdict": "Likely ghosted — 21 days with no response is past the point of normal delays.",
    "advice": "Send one final polite nudge, then move on. Don't wait on this."
  }
}

Rules for the draft:
- Professional, warm, concise (under 120 words).
- Reference the company, the exact role, and how long ago they applied.
- One clear ask: an update on the process.
- Never desperate, never guilt-trippy, never generic.
- Sign off as "Best regards" (no name — they'll add it).

Rules for ghosting:
- score 1-10: how likely this application is dead. Base it on daysWaiting: <7 = low (1-3), 7-14 = medium (4-6), 14+ = high (7-10). Adjust slightly for context.
- verdict: one honest sentence. No false hope.
- advice: one concrete next step.`;

interface Body {
  company?: string;
  role?: string;
  daysWaiting?: number;
  notes?: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const { company, role, daysWaiting } = body;
  if (!company?.trim() || !role?.trim() || typeof daysWaiting !== "number") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // try twice — the model occasionally returns malformed JSON
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await chat(
        [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Application: ${role} at ${company}. Applied ${daysWaiting} days ago with no response.${body.notes ? ` Notes: ${body.notes}` : ""}`,
          },
        ],
        { temperature: 0.5, maxTokens: 1200 }
      );

      const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      // extract the JSON object if there's surrounding text
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      const jsonStr = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
      const parsed = JSON.parse(jsonStr);

      if (!parsed.draft?.subject || !parsed.draft?.body || typeof parsed.ghosting?.score !== "number") {
        throw new Error("bad shape");
      }
      parsed.ghosting.score = Math.min(10, Math.max(1, Math.round(parsed.ghosting.score)));
      return NextResponse.json(parsed);
    } catch (e) {
      console.error(`analyze attempt ${attempt + 1} failed:`, e instanceof Error ? e.message : e);
      if (attempt === 1) {
        return NextResponse.json(
          { error: "Couldn't generate the analysis. Try again." },
          { status: 500 }
        );
      }
    }
  }
  return NextResponse.json({ error: "Couldn't generate the analysis. Try again." }, { status: 500 });
}

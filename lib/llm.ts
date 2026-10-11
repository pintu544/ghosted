const BASE_URL = process.env.FASTROUTER_BASE_URL!;
const API_KEY = process.env.FASTROUTER_API_KEY!;
const MODEL = process.env.FASTROUTER_MODEL!;

interface Msg {
  role: "system" | "user";
  content: string;
}

export async function chat(
  messages: Msg[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 1500,
    }),
  });
  if (!res.ok) {
    throw new Error(`LLM request failed: ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  type Application,
  daysWaiting,
  flagFor,
} from "@/lib/applications";
import { cn } from "@/lib/utils";

interface Analysis {
  draft: { subject: string; body: string };
  ghosting: { score: number; verdict: string; advice: string };
}

interface Props {
  app: Application | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Application["status"]) => void;
  onFollowedUp: (id: string) => void;
}

function scoreColor(s: number): string {
  if (s <= 3) return "text-emerald-400";
  if (s <= 6) return "text-amber-400";
  return "text-red-400";
}

export default function ActionModal({ app, onClose, onStatusChange, onFollowedUp }: Props) {
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setData(null);
    setError(null);
    setCopied(false);
    if (!app) return;
    const flag = flagFor(app);
    if (flag !== "follow-up" && flag !== "ghosted") return;
    setLoading(true);
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: app.company,
        role: app.role,
        daysWaiting: daysWaiting(app),
        notes: app.notes ?? "",
      }),
    })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "failed");
        setData(j);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "failed"))
      .finally(() => setLoading(false));
  }, [app]);

  const copy = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(
      `Subject: ${data.draft.subject}\n\n${data.draft.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const flag = app ? flagFor(app) : "waiting";

  return (
    <Dialog open={!!app} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-zinc-800 bg-zinc-950 sm:max-w-lg">
        {app && (
          <>
            <DialogHeader>
              <DialogTitle className="text-zinc-100">
                {app.company} <span className="font-normal text-zinc-400">— {app.role}</span>
              </DialogTitle>
              <p className="text-sm text-zinc-500">
                Applied {daysWaiting(app)} days ago
                {app.followedUpAt ? " · followed up already" : ""}
              </p>
            </DialogHeader>

            {loading && (
              <div className="py-8 text-center">
                <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-1/3 animate-[slide_1.2s_ease-in-out_infinite] rounded-full bg-amber-400" />
                </div>
                <p className="mt-3 text-sm text-zinc-500">Reading the silence…</p>
              </div>
            )}

            {error && <p className="py-4 text-center text-sm text-red-400">{error}</p>}

            {data && (
              <div className="grid gap-5">
                {/* ghosting score */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      Ghosting score
                    </p>
                    <p className={cn("text-3xl font-bold", scoreColor(data.ghosting.score))}>
                      {data.ghosting.score}
                      <span className="text-sm font-normal text-zinc-500">/10</span>
                    </p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={cn("h-full rounded-full transition-all", scoreColor(data.ghosting.score).replace("text-", "bg-"))}
                      style={{ width: `${data.ghosting.score * 10}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-zinc-200">{data.ghosting.verdict}</p>
                  <p className="mt-1 text-sm text-zinc-400">{data.ghosting.advice}</p>
                </div>

                <Separator className="bg-zinc-800" />

                {/* draft */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                    Follow-up draft
                  </p>
                  <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <p className="text-sm font-semibold text-zinc-200">
                      Subject: {data.draft.subject}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                      {data.draft.body}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={copy} className="bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300">
                      {copied ? "Copied ✓" : "Copy email"}
                    </Button>
                    {flag === "follow-up" && (
                      <Button
                        variant="outline"
                        onClick={() => { onFollowedUp(app.id); onClose(); }}
                        className="border-zinc-700 text-zinc-300 hover:border-zinc-500"
                      >
                        Mark followed up
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                {/* status */}
                <div className="flex flex-wrap gap-2">
                  {(["interview", "rejected", "offer"] as const).map((s) => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      onClick={() => { onStatusChange(app.id, s); onClose(); }}
                      className="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                    >
                      Mark: {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

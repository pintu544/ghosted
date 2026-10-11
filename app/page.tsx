"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ApplicationCard from "@/components/ApplicationCard";
import AddApplication from "@/components/AddApplication";
import ActionModal from "@/components/ActionModal";
import {
  type Application,
  SAMPLE_APPLICATIONS,
  flagFor,
} from "@/lib/applications";

const STORE_KEY = "ghosted-applications-v1";

function load(): Application[] | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [apps, setApps] = useState<Application[]>([]);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  useEffect(() => {
    setApps(load() ?? []);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(apps));
    } catch {
      /* ignore */
    }
  }, [apps, ready]);

  const add = (a: Application) => setApps((p) => [a, ...p]);

  const changeStatus = (id: string, status: Application["status"]) =>
    setApps((p) => p.map((a) => (a.id === id ? { ...a, status } : a)));

  const markFollowedUp = (id: string) =>
    setApps((p) =>
      p.map((a) =>
        a.id === id ? { ...a, followedUpAt: new Date().toISOString().slice(0, 10) } : a
      )
    );

  const loadSample = () => setApps(SAMPLE_APPLICATIONS);

  if (!ready) return null;

  const needsAttention = apps.filter((a) => {
    const f = flagFor(a);
    return f === "follow-up" || f === "ghosted";
  });

  const columns: { title: string; flag: "waiting" | "follow-up" | "ghosted" | "resolved"; apps: Application[] }[] = [
    { title: "Waiting", flag: "waiting", apps: apps.filter((a) => flagFor(a) === "waiting") },
    { title: "Follow-up due", flag: "follow-up", apps: apps.filter((a) => flagFor(a) === "follow-up") },
    { title: "Likely ghosted", flag: "ghosted", apps: apps.filter((a) => flagFor(a) === "ghosted") },
    { title: "Resolved", flag: "resolved", apps: apps.filter((a) => flagFor(a) === "resolved") },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
              Ghosted
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Never get ghosted again.
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {apps.length === 0
                ? "Log your applications — we'll watch the silence."
                : needsAttention.length > 0
                  ? `${needsAttention.length} application${needsAttention.length > 1 ? "s need" : " needs"} your attention today.`
                  : "All quiet. Nothing needs you right now."}
            </p>
          </div>
          <div className="flex gap-2">
            {apps.length === 0 && (
              <Button variant="outline" onClick={loadSample} className="border-zinc-700 text-zinc-300 hover:border-zinc-500">
                Try sample data →
              </Button>
            )}
            <AddApplication onAdd={add} />
          </div>
        </div>

        {/* pipeline */}
        {apps.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-3">
                <div className="flex items-center justify-between px-1 pb-3">
                  <h2 className="text-sm font-semibold text-zinc-300">{col.title}</h2>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                    {col.apps.length}
                  </span>
                </div>
                <div className="grid gap-2.5">
                  {col.apps.map((a) => (
                    <ApplicationCard key={a.id} app={a} onAction={setSelected} />
                  ))}
                  {col.apps.length === 0 && (
                    <p className="px-1 py-4 text-center text-xs text-zinc-600">
                      Nothing here
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-zinc-500">
              Every application you send into the void, tracked.
              We&apos;ll tell you when it&apos;s time to follow up —
              and write the email for you.
            </p>
          </div>
        )}

        <p className="mt-12 pb-4 text-center text-xs text-zinc-600">
          Your data never leaves this browser.
        </p>
      </div>

      <ActionModal
        app={selected}
        onClose={() => setSelected(null)}
        onStatusChange={changeStatus}
        onFollowedUp={markFollowedUp}
      />
    </div>
  );
}

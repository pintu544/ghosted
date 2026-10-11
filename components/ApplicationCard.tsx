"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  type Application,
  daysWaiting,
  flagFor,
  flagMeta,
} from "@/lib/applications";
import { cn } from "@/lib/utils";

interface Props {
  app: Application;
  onAction: (app: Application) => void;
}

export default function ApplicationCard({ app, onAction }: Props) {
  const days = daysWaiting(app);
  const flag = flagFor(app);
  const meta = flagMeta(flag);
  const actionable = flag === "follow-up" || flag === "ghosted";

  return (
    <Card
      className={cn(
        "cursor-pointer border-zinc-800 bg-zinc-900/60 transition-all hover:border-zinc-600 hover:bg-zinc-900",
        actionable && "hover:border-amber-500/50"
      )}
      onClick={() => onAction(app)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-zinc-100">
              {app.company}
            </p>
            <p className="truncate text-sm text-zinc-400">{app.role}</p>
          </div>
          <span className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", meta.dot)} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline" className={cn("text-xs font-medium", meta.classes)}>
            {meta.label}
          </Badge>
          <p className="text-xs text-zinc-500">
            {app.status === "waiting"
              ? `${days}d waiting`
              : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
          </p>
        </div>

        {actionable && (
          <p className="mt-3 border-t border-zinc-800 pt-2.5 text-xs font-medium text-amber-300/90">
            {flag === "follow-up" ? "→ Draft follow-up" : "→ Check ghosting score"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

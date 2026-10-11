export interface Application {
  id: string;
  company: string;
  role: string;
  appliedDate: string; // ISO date (yyyy-mm-dd)
  status: "waiting" | "interview" | "rejected" | "offer";
  followedUpAt?: string; // ISO date — resets the clock
  notes?: string;
}

export type Flag = "waiting" | "follow-up" | "ghosted" | "resolved";

export const FOLLOW_UP_DAYS = 7;
export const GHOSTED_DAYS = 14;

export function daysWaiting(app: Application, now: Date = new Date()): number {
  const ref = app.followedUpAt ?? app.appliedDate;
  const refDate = new Date(ref + "T00:00:00");
  const diff = now.getTime() - refDate.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

export function flagFor(app: Application, now: Date = new Date()): Flag {
  if (app.status !== "waiting") return "resolved";
  const d = daysWaiting(app, now);
  if (d >= GHOSTED_DAYS) return "ghosted";
  if (d >= FOLLOW_UP_DAYS) return "follow-up";
  return "waiting";
}

export function flagMeta(flag: Flag): {
  label: string;
  classes: string;
  dot: string;
} {
  switch (flag) {
    case "follow-up":
      return {
        label: "Follow-up due",
        classes: "border-amber-500/40 bg-amber-500/10 text-amber-300",
        dot: "bg-amber-400",
      };
    case "ghosted":
      return {
        label: "Likely ghosted",
        classes: "border-red-500/40 bg-red-500/10 text-red-300",
        dot: "bg-red-400",
      };
    case "resolved":
      return {
        label: "Resolved",
        classes: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
        dot: "bg-emerald-400",
      };
    default:
      return {
        label: "Waiting",
        classes: "border-zinc-600/60 bg-zinc-800/60 text-zinc-300",
        dot: "bg-zinc-400",
      };
  }
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

let seq = 0;
const nid = () => `app-${Date.now()}-${seq++}`;

export const SAMPLE_APPLICATIONS: Application[] = [
  { id: nid(), company: "Razorpay", role: "Senior Frontend Engineer", appliedDate: daysAgo(12), status: "waiting" },
  { id: nid(), company: "Zerodha", role: "Full Stack Developer", appliedDate: daysAgo(3), status: "waiting" },
  { id: nid(), company: "Swiggy", role: "Backend Engineer", appliedDate: daysAgo(21), status: "waiting" },
  { id: nid(), company: "CRED", role: "Frontend Engineer", appliedDate: daysAgo(1), status: "waiting" },
  { id: nid(), company: "PhonePe", role: "Full Stack Developer", appliedDate: daysAgo(8), status: "waiting" },
  { id: nid(), company: "Freshworks", role: "Backend Engineer", appliedDate: daysAgo(16), status: "waiting" },
  { id: nid(), company: "Postman", role: "Frontend Engineer", appliedDate: daysAgo(5), status: "interview", notes: "Round 2 scheduled" },
];

export function newId(): string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

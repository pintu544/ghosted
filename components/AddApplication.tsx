"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Application, newId } from "@/lib/applications";

interface Props {
  onAdd: (app: Application) => void;
}

export default function AddApplication({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const submit = () => {
    if (!company.trim() || !role.trim() || !date) return;
    onAdd({
      id: newId(),
      company: company.trim(),
      role: role.trim(),
      appliedDate: date,
      status: "waiting",
    });
    setCompany("");
    setRole("");
    setDate(new Date().toISOString().slice(0, 10));
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
      >
        + Log application
      </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Log an application</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="company" className="text-zinc-300">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Razorpay"
              className="border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role" className="text-zinc-300">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Senior Frontend Engineer"
              className="border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-zinc-300">Date applied</Label>
            <Input
              id="date"
              type="date"
              value={date}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>
          <Button
            onClick={submit}
            disabled={!company.trim() || !role.trim()}
            className="bg-amber-400 font-semibold text-zinc-950 hover:bg-amber-300"
          >
            Add to pipeline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

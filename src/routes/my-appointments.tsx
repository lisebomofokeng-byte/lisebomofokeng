import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Calendar as CalIcon, X, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";
import { APPOINTMENTS, getService, getStylist, formatDuration, formatPrice, type Appointment, type AppointmentStatus } from "@/lib/salon-data";

export const Route = createFileRoute("/my-appointments")({
  head: () => ({
    meta: [
      { title: "My Appointments — Aura Salon" },
      { name: "description", content: "Track and manage your upcoming and past salon visits." },
    ],
  }),
  component: MyAppointmentsPage,
});

function MyAppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>(
    APPOINTMENTS.filter((a) => a.clientName.includes("(You)")),
  );
  const [modal, setModal] = useState<null | { type: "reschedule" | "cancel"; appt: Appointment }>(null);
  const [busy, setBusy] = useState(false);
  const [newTime, setNewTime] = useState("");

  const now = new Date().toISOString().slice(0, 10);
  const upcoming = items.filter((a) => a.date >= now && a.status !== "Completed" && a.status !== "Cancelled");
  const past = items.filter((a) => a.date < now || a.status === "Completed" || a.status === "Cancelled");

  const confirm = () => {
    if (!modal) return;
    setBusy(true);
    setTimeout(() => {
      if (modal.type === "cancel") {
        setItems((prev) => prev.map((x) => (x.id === modal.appt.id ? { ...x, status: "Cancelled" } : x)));
        toast.success("Appointment cancelled");
      } else {
        setItems((prev) => prev.map((x) => (x.id === modal.appt.id ? { ...x, startTime: newTime || x.startTime } : x)));
        toast.success("Reschedule requested", { description: "A stylist will confirm shortly." });
      }
      setBusy(false);
      setModal(null);
      setNewTime("");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">My appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage upcoming visits and revisit past sessions.</p>
      </header>

      <Section title="Upcoming">
        {upcoming.length === 0 && <EmptyState text="No upcoming appointments — time to book your next visit." />}
        <div className="grid gap-3">
          {upcoming.map((a) => (
            <ApptRow key={a.id} appt={a} onReschedule={() => setModal({ type: "reschedule", appt: a })} onCancel={() => setModal({ type: "cancel", appt: a })} />
          ))}
        </div>
      </Section>

      <Section title="Past visits" className="mt-10">
        <div className="grid gap-3">
          {past.map((a) => <ApptRow key={a.id} appt={a} past />)}
        </div>
      </Section>

      <ResponsibleAiNote className="mt-10" />

      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal?.type === "cancel" ? "Cancel appointment?" : "Reschedule appointment"}</DialogTitle>
            <DialogDescription>
              {modal?.type === "cancel"
                ? "This will release your slot. Cancellations within 24 hours may incur a fee."
                : "Choose a new time. A stylist will confirm availability."}
            </DialogDescription>
          </DialogHeader>
          {modal?.type === "reschedule" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">New time</label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)} disabled={busy}>Keep as is</Button>
            <Button onClick={confirm} disabled={busy} variant={modal?.type === "cancel" ? "destructive" : "default"}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {modal?.type === "cancel" ? "Yes, cancel" : "Request reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">{text}</div>;
}

const statusStyles: Record<AppointmentStatus, string> = {
  Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Pending Deposit": "bg-amber-100 text-amber-800 border-amber-200",
  Completed: "bg-slate-100 text-slate-700 border-slate-200",
  Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

function ApptRow({ appt, onReschedule, onCancel, past }: { appt: Appointment; onReschedule?: () => void; onCancel?: () => void; past?: boolean }) {
  const service = getService(appt.serviceId);
  const stylist = getStylist(appt.stylistId);
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground" style={{ background: stylist.avatarColor }}>
            {stylist.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{service.name}</span>
              <Badge variant="outline" className={`border ${statusStyles[appt.status]}`}>{appt.status}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><CalIcon className="h-3 w-3" /> {new Date(appt.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {appt.startTime} · {formatDuration(service.durationMin)}</span>
              <span>with {stylist.name}</span>
              <span className="font-medium text-foreground">{formatPrice(service.price)}</span>
            </div>
          </div>
        </div>
        {!past && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onReschedule}><RotateCcw className="h-3.5 w-3.5" /> Reschedule</Button>
            <Button size="sm" variant="ghost" onClick={onCancel}><X className="h-3.5 w-3.5" /> Cancel</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
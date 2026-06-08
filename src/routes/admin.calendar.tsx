import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar as CalIcon, DollarSign, Percent, Users, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";
import { APPOINTMENTS, STYLISTS, TIME_SLOTS, getService, getStylist, formatPrice, type Appointment } from "@/lib/salon-data";

export const Route = createFileRoute("/admin/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar Grid — Aura Admin" },
      { name: "description", content: "Daily stylist grid, occupancy and revenue at a glance." },
    ],
  }),
  component: AdminCalendar,
});

function AdminCalendar() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [appts, setAppts] = useState<Appointment[]>(APPOINTMENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const todays = appts.filter((a) => a.date === date && a.status !== "Cancelled");

  const stats = useMemo(() => {
    const totalSlots = STYLISTS.length * TIME_SLOTS.length;
    const bookedMin = todays.reduce((sum, a) => sum + getService(a.serviceId).durationMin, 0);
    const totalMin = STYLISTS.length * (TIME_SLOTS.length * 30);
    const revenue = todays.reduce((sum, a) => sum + getService(a.serviceId).price, 0);
    return {
      bookings: todays.length,
      occupancy: Math.round((bookedMin / totalMin) * 100),
      revenue,
      totalSlots,
    };
  }, [todays]);

  const selected = selectedId ? appts.find((a) => a.id === selectedId) ?? null : null;

  const updateSelected = (patch: Partial<Appointment>) => {
    if (!selected) return;
    setAppts((prev) => prev.map((a) => (a.id === selected.id ? { ...a, ...patch } : a)));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">Daily calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Side-by-side stylist schedules and bookings.</p>
        </div>
        <div className="flex items-center gap-2">
          <CalIcon className="h-4 w-4 text-muted-foreground" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44" />
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={<Users className="h-4 w-4" />} label="Bookings today" value={String(stats.bookings)} />
        <Stat icon={<Percent className="h-4 w-4" />} label="Occupancy" value={`${stats.occupancy}%`} />
        <Stat icon={<DollarSign className="h-4 w-4" />} label="Est. revenue" value={formatPrice(stats.revenue)} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="min-w-[720px]">
          <div className="grid sticky top-0 z-10 bg-card" style={{ gridTemplateColumns: `80px repeat(${STYLISTS.length}, minmax(0, 1fr))` }}>
            <div className="border-b border-r p-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time</div>
            {STYLISTS.map((s) => (
              <div key={s.id} className="border-b p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground" style={{ background: s.avatarColor }}>{s.initials}</div>
                  <div>
                    <div className="text-sm font-medium leading-tight">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">{s.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {TIME_SLOTS.map((t) => (
            <div key={t} className="grid" style={{ gridTemplateColumns: `80px repeat(${STYLISTS.length}, minmax(0, 1fr))` }}>
              <div className="border-b border-r p-2 text-xs text-muted-foreground">{t}</div>
              {STYLISTS.map((s) => {
                const appt = todays.find((a) => a.stylistId === s.id && a.startTime === t);
                return (
                  <div key={s.id} className="relative border-b p-1.5 min-h-[44px]">
                    {appt && <SlotCard appt={appt} onClick={() => setSelectedId(appt.id)} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <ResponsibleAiNote className="mt-8" />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.clientName}</SheetTitle>
                <SheetDescription>{selected.clientEmail}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Service</div>
                  <div className="mt-1 font-medium">{getService(selected.serviceId).name}</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(getService(selected.serviceId).price)}</div>
                </div>
                <Field label="Stylist">
                  <Select value={selected.stylistId} onValueChange={(v) => updateSelected({ stylistId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STYLISTS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Time">
                  <Select value={selected.startTime} onValueChange={(v) => updateSelected({ startTime: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Client notes">
                  <Textarea
                    value={selected.notes ?? ""}
                    onChange={(e) => updateSelected({ notes: e.target.value })}
                    placeholder="Allergies, preferences, prior services…"
                    rows={4}
                  />
                </Field>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Service history</div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>· Balayage — 3 months ago with {getStylist(selected.stylistId).name}</li>
                    <li>· Gloss treatment — 5 months ago</li>
                  </ul>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => { toast.success("Changes saved"); setSelectedId(null); }} className="flex-1">Save changes</Button>
                  <Button variant="outline" onClick={() => setSelectedId(null)}><X className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 font-serif text-2xl">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function SlotCard({ appt, onClick }: { appt: Appointment; onClick: () => void }) {
  const service = getService(appt.serviceId);
  const stylist = getStylist(appt.stylistId);
  const heightUnits = Math.max(1, Math.round(service.durationMin / 30));
  const height = heightUnits * 44 - 8;
  const isPending = appt.status === "Pending Deposit";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ height, background: isPending ? "var(--cream)" : stylist.avatarColor, color: isPending ? "var(--foreground)" : "var(--primary-foreground)" }}
      className="absolute inset-x-1.5 top-1.5 z-10 overflow-hidden rounded-md p-2 text-left text-xs shadow-sm transition-transform hover:-translate-y-0.5"
    >
      <div className="truncate font-medium">{appt.clientName.replace(" (You)", "")}</div>
      <div className="truncate opacity-80">{service.name}</div>
      {isPending && <Badge variant="outline" className="mt-1 border-amber-300 bg-white text-[9px] text-amber-800">Pending</Badge>}
    </button>
  );
}
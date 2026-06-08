import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, Loader2, Sparkles, User, Calendar as CalIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";
import { SERVICES, STYLISTS, TIME_SLOTS, formatDuration, formatPrice, getService, getStylist, type Service, type Stylist } from "@/lib/salon-data";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Appointment — Aura Salon" },
      { name: "description", content: "Reserve a session with our master stylists in 4 elegant steps." },
    ],
  }),
  component: BookPage,
});

type Step = 1 | 2 | 3 | 4 | 5;

function BookPage() {
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [stylistId, setStylistId] = useState<string | "any" | null>(null);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const service = serviceId ? getService(serviceId) : null;
  const stylist = stylistId && stylistId !== "any" ? getStylist(stylistId) : null;

  const grouped = useMemo(() => {
    const map = new Map<string, Service[]>();
    SERVICES.forEach((s) => {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    });
    return Array.from(map.entries());
  }, []);

  const filteredSlots = useMemo(() => {
    if (!service) return TIME_SLOTS;
    if (service.durationMin >= 150) return TIME_SLOTS.filter((t) => t <= "12:00");
    return TIME_SLOTS;
  }, [service]);

  const goNext = (next: Step) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTransitioning(false);
    }, 700);
  };

  const canNext = () => {
    if (step === 1) return !!serviceId;
    if (step === 2) return !!stylistId;
    if (step === 3) return !!time;
    if (step === 4) return form.name && form.email && form.phone;
    return false;
  };

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(5);
      toast.success("Appointment confirmed", { description: "A confirmation has been sent to your email." });
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: "var(--gold)" }}>
          <Sparkles className="h-3 w-3" /> AI Booking Assistant
        </div>
        <h1 className="mt-2 font-serif text-3xl font-light tracking-tight sm:text-4xl">Reserve your appointment</h1>
        <p className="mt-1 text-sm text-muted-foreground">A few elegant steps and you're set.</p>
      </header>

      <Stepper step={step} />

      <div className="mt-8">
        {transitioning ? (
          <div className="flex h-72 items-center justify-center rounded-2xl border bg-card">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--gold)" }} />
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-6">
                {grouped.map(([cat, list]) => (
                  <div key={cat}>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {list.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setServiceId(s.id)}
                          className={`group rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)] ${serviceId === s.id ? "border-[var(--gold)] ring-1 ring-[var(--gold)]" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium">{s.name}</div>
                              <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatPrice(s.price)}</div>
                              <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="h-3 w-3" /> {formatDuration(s.durationMin)}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StylistCard
                  isAny
                  selected={stylistId === "any"}
                  onClick={() => setStylistId("any")}
                />
                {STYLISTS.map((s) => (
                  <StylistCard
                    key={s.id}
                    stylist={s}
                    selected={stylistId === s.id}
                    onClick={() => setStylistId(s.id)}
                  />
                ))}
              </div>
            )}

            {step === 3 && service && (
              <div className="grid gap-4 sm:grid-cols-[260px_1fr]">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pick a date</CardTitle>
                    <CardDescription className="text-xs">Slots adapt to service length.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                    />
                    {service.durationMin >= 150 && (
                      <p className="mt-3 rounded-md bg-[var(--cream)] p-2 text-[11px] text-foreground">
                        ⏳ {service.name} runs {formatDuration(service.durationMin)} — only early slots shown.
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Available times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {filteredSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`rounded-md border px-3 py-2 text-sm transition-all ${time === t ? "border-[var(--gold)] bg-[var(--cream)] font-medium" : "hover:border-[var(--gold)]"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Your details</CardTitle>
                    <CardDescription>All fields are editable before confirming.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <FormRow label="Full name">
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Maya Patel" />
                    </FormRow>
                    <FormRow label="Email">
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                    </FormRow>
                    <FormRow label="Phone">
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 555-5555" />
                    </FormRow>
                    <FormRow label="Notes (optional)">
                      <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Allergies, preferences…" />
                    </FormRow>
                  </CardContent>
                </Card>
                <SummaryCard service={service} stylist={stylist} stylistId={stylistId} date={date} time={time} form={form} />
              </div>
            )}

            {step === 5 && (
              <div className="rounded-2xl border bg-card p-10 text-center shadow-[var(--shadow-elegant)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--gradient-gold)" }}>
                  <Check className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mt-4 font-serif text-2xl font-light">You're booked.</h2>
                <p className="mt-2 text-sm text-muted-foreground">We can't wait to see you, {form.name || "friend"}.</p>
                <div className="mt-6">
                  <SummaryCard inline service={service} stylist={stylist} stylistId={stylistId} date={date} time={time} form={form} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {step < 5 && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={step === 1 || transitioning}
            onClick={() => goNext((step - 1) as Step)}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < 4 ? (
            <Button
              disabled={!canNext() || transitioning}
              onClick={() => goNext((step + 1) as Step)}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button disabled={!canNext() || submitting} onClick={handleConfirm}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming…</> : <>Confirm booking <Check className="h-4 w-4" /></>}
            </Button>
          )}
        </div>
      )}

      <ResponsibleAiNote className="mt-10" />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const labels = ["Service", "Stylist", "Date & Time", "Details", "Done"];
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {labels.map((l, i) => {
        const active = step === i + 1;
        const done = step > i + 1;
        return (
          <div key={l} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                done ? "bg-[var(--gold)] text-primary" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`hidden text-xs sm:inline ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}>{l}</span>
            {i < labels.length - 1 && <div className="h-px w-6 bg-border sm:w-8" />}
          </div>
        );
      })}
    </div>
  );
}

function StylistCard({ stylist, isAny, selected, onClick }: { stylist?: Stylist; isAny?: boolean; selected: boolean; onClick: () => void }) {
  if (isAny) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group rounded-xl border bg-card p-5 text-left transition-all hover:-translate-y-0.5 ${selected ? "border-[var(--gold)] ring-1 ring-[var(--gold)]" : ""}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--gradient-gold)" }}>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 font-medium">First Available Expert</div>
        <p className="mt-1 text-xs text-muted-foreground">AI matches the best-fit stylist for your service.</p>
      </button>
    );
  }
  if (!stylist) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-xl border bg-card p-5 text-left transition-all hover:-translate-y-0.5 ${selected ? "border-[var(--gold)] ring-1 ring-[var(--gold)]" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground" style={{ background: stylist.avatarColor }}>
          {stylist.initials}
        </div>
        <div>
          <div className="font-medium">{stylist.name}</div>
          <div className="text-xs text-muted-foreground">{stylist.title}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="outline" className="border-[var(--gold)]/50 text-[10px] uppercase tracking-wide">{stylist.tier}</Badge>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{stylist.bio}</p>
    </button>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function SummaryCard({
  service, stylist, stylistId, date, time, form, inline,
}: {
  service: Service | null;
  stylist: Stylist | null;
  stylistId: string | null;
  date: string;
  time: string | null;
  form: { name: string; email: string; phone: string; notes: string };
  inline?: boolean;
}) {
  const stylistLabel = stylistId === "any" ? "First Available Expert" : stylist?.name ?? "—";
  return (
    <div className={`rounded-2xl border p-5 ${inline ? "bg-card mx-auto max-w-md text-left" : "bg-card shadow-[var(--shadow-soft)]"}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--gold)" }}>Appointment Summary</div>
      <div className="mt-3 space-y-2 text-sm">
        <Row icon={<Sparkles className="h-3.5 w-3.5" />} label="Service" value={service ? `${service.name} · ${formatPrice(service.price)}` : "—"} />
        <Row icon={<User className="h-3.5 w-3.5" />} label="Stylist" value={stylistLabel} />
        <Row icon={<CalIcon className="h-3.5 w-3.5" />} label="Date" value={new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} />
        <Row icon={<Clock className="h-3.5 w-3.5" />} label="Time" value={time ? `${time} · ${service ? formatDuration(service.durationMin) : ""}` : "—"} />
      </div>
      <div className="mt-4 border-t pt-4 text-sm">
        <div className="font-medium">{form.name || "Your name"}</div>
        <div className="text-xs text-muted-foreground">{form.email || "email"} · {form.phone || "phone"}</div>
        {form.notes && <div className="mt-2 text-xs text-muted-foreground">"{form.notes}"</div>}
      </div>
      {service && (
        <div className="mt-4 flex items-baseline justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">Estimated total</span>
          <span className="font-serif text-xl">{formatPrice(service.price)}</span>
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
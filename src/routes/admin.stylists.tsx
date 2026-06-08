import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";
import { STYLISTS, TIME_SLOTS } from "@/lib/salon-data";

export const Route = createFileRoute("/admin/stylists")({
  head: () => ({
    meta: [
      { title: "Stylist Schedules — Aura Admin" },
      { name: "description", content: "Toggle weekly availability for each stylist." },
    ],
  }),
  component: AdminStylists,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function AdminStylists() {
  const [active, setActive] = useState(STYLISTS[0].id);
  const stylist = STYLISTS.find((s) => s.id === active)!;
  const [grid, setGrid] = useState<Record<string, Record<string, boolean>>>(() => {
    const g: Record<string, Record<string, boolean>> = {};
    STYLISTS.forEach((s) => {
      g[s.id] = {};
      DAYS.forEach((d) => TIME_SLOTS.forEach((t) => {
        g[s.id][`${d}-${t}`] = d !== "Sun" && t >= "09:00" && t <= "17:00";
      }));
    });
    return g;
  });

  const toggle = (d: string, t: string) => {
    setGrid((prev) => ({ ...prev, [active]: { ...prev[active], [`${d}-${t}`]: !prev[active][`${d}-${t}`] } }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">Stylist schedules</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap to toggle availability.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {STYLISTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${active === s.id ? "border-[var(--gold)] bg-[var(--cream)]" : "hover:border-[var(--gold)]"}`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-primary-foreground" style={{ background: s.avatarColor }}>{s.initials}</span>
            {s.name}
            <Badge variant="outline" className="border-[var(--gold)]/40 text-[9px] uppercase">{s.tier}</Badge>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="min-w-[680px]">
          <div className="grid" style={{ gridTemplateColumns: `80px repeat(${DAYS.length}, minmax(0,1fr))` }}>
            <div className="border-b border-r p-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{stylist.name.split(" ")[0]}</div>
            {DAYS.map((d) => <div key={d} className="border-b p-2 text-center text-xs font-medium">{d}</div>)}
          </div>
          {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((t) => (
            <div key={t} className="grid" style={{ gridTemplateColumns: `80px repeat(${DAYS.length}, minmax(0,1fr))` }}>
              <div className="border-b border-r p-2 text-xs text-muted-foreground">{t}</div>
              {DAYS.map((d) => {
                const on = grid[active][`${d}-${t}`];
                return (
                  <button
                    key={d}
                    onClick={() => toggle(d, t)}
                    className={`flex items-center justify-center border-b p-2 transition-colors ${on ? "bg-[var(--cream)] text-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`}
                  >
                    {on ? <Check className="h-3.5 w-3.5" style={{ color: "var(--gold)" }} /> : <X className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <ResponsibleAiNote className="mt-8" />
    </div>
  );
}
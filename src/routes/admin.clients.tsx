import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";
import { APPOINTMENTS, getService, getStylist, formatPrice } from "@/lib/salon-data";

export const Route = createFileRoute("/admin/clients")({
  head: () => ({
    meta: [
      { title: "Client Database — Aura Admin" },
      { name: "description", content: "Searchable client list with visit history and lifetime value." },
    ],
  }),
  component: AdminClients,
});

function AdminClients() {
  const [q, setQ] = useState("");

  const clients = useMemo(() => {
    const map = new Map<string, { name: string; email: string; visits: number; lastVisit: string; lifetime: number; favStylist: string }>();
    APPOINTMENTS.forEach((a) => {
      const prev = map.get(a.clientEmail);
      const price = getService(a.serviceId).price;
      const next = prev ?? { name: a.clientName, email: a.clientEmail, visits: 0, lastVisit: a.date, lifetime: 0, favStylist: a.stylistId };
      next.visits += 1;
      next.lifetime += price;
      if (a.date > next.lastVisit) next.lastVisit = a.date;
      map.set(a.clientEmail, next);
    });
    const list = Array.from(map.values()).sort((a, b) => b.lifetime - a.lifetime);
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">Client database</h1>
          <p className="mt-1 text-sm text-muted-foreground">{clients.length} clients · sorted by lifetime value.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="pl-9" />
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Last visit</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">Favorite</th>
              <th className="px-4 py-3 text-right">Lifetime</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => {
              const s = getStylist(c.favStylist);
              const isVip = c.lifetime >= 300;
              return (
                <tr key={c.email} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name.replace(" (You)", "")}</span>
                      {isVip && <Badge variant="outline" className="border-[var(--gold)] text-[10px]" style={{ color: "var(--gold)" }}>VIP</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(c.lastVisit).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{c.visits}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-primary-foreground" style={{ background: s.avatarColor }}>{s.initials}</span>
                      {s.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(c.lifetime)}</td>
                </tr>
              );
            })}
            {clients.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No clients match "{q}".</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ResponsibleAiNote className="mt-8" />
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";
import { SERVICES, formatDuration, formatPrice } from "@/lib/salon-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Aura Salon" },
      { name: "description", content: "Browse our menu of premium hair services with transparent pricing." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const cats = Array.from(new Set(SERVICES.map((s) => s.category)));
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">Services & pricing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Transparent pricing. No surprises.</p>
      </header>
      <div className="space-y-10">
        {cats.map((c) => (
          <section key={c}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-serif text-xl">{c}</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="divide-y rounded-2xl border bg-card">
              {SERVICES.filter((s) => s.category === c).map((s) => (
                <div key={s.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{formatDuration(s.durationMin)}</span>
                    <span className="font-serif text-lg">{formatPrice(s.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <ResponsibleAiNote className="mt-10" />
    </div>
  );
}
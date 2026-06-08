import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarPlus, CalendarCheck, Scissors, CalendarRange, ArrowRight, Sparkles } from "lucide-react";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura Salon Booking Platform" },
      { name: "description", content: "Book premium salon services with master stylists. Modern, elegant, and effortless." },
    ],
  }),
  component: Overview,
});

const tiles = [
  { title: "Book Appointment", description: "Step-by-step guided booking with your favorite stylist.", icon: CalendarPlus, href: "/book" as const, primary: true },
  { title: "My Appointments", description: "Track upcoming visits, reschedule or cancel with one tap.", icon: CalendarCheck, href: "/my-appointments" as const },
  { title: "Services & Pricing", description: "Browse our full menu of cuts, color and treatments.", icon: Scissors, href: "/services" as const },
  { title: "Admin Calendar", description: "Staff view — daily grid, occupancy and revenue.", icon: CalendarRange, href: "/admin/calendar" as const },
];

function Overview() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section
        className="relative overflow-hidden rounded-3xl border p-10 shadow-[var(--shadow-elegant)]"
        style={{ background: "linear-gradient(135deg, oklch(0.18 0.02 250), oklch(0.26 0.03 250))" }}
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-gold)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
            <Sparkles className="h-3.5 w-3.5" /> Premium hair salon
          </div>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-light leading-tight text-primary-foreground sm:text-5xl">
            Effortless booking. Unforgettable style.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-primary-foreground/70 sm:text-base">
            Reserve your seat with our master colorists, barbers and stylists in a few elegant steps.
          </p>
          <Link
            to="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-lg transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gradient-gold)", color: "var(--gold-foreground)" }}
          >
            Book your appointment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.href}
            to={t.href}
            className="group flex flex-col rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-[var(--gold)] hover:shadow-[var(--shadow-elegant)]"
          >
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
              style={t.primary
                ? { background: "var(--gradient-gold)", color: "var(--gold-foreground)" }
                : { background: "var(--cream)", color: "var(--primary)" }}
            >
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight">{t.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-foreground">
              Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </section>

      <ResponsibleAiNote className="mt-10" />
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Compass,
  Globe2,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Plane,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/travel-curator")({
  head: () => ({
    meta: [
      { title: "The Travel Curator ZA — Curated journeys from South Africa" },
      {
        name: "description",
        content:
          "Bespoke, thoughtfully curated holidays for South African travellers — local escapes, island getaways and international adventures.",
      },
    ],
  }),
  component: TravelCurator,
});

const sand = "oklch(0.95 0.025 75)";
const terracotta = "oklch(0.6 0.13 45)";
const ocean = "oklch(0.3 0.05 220)";

const nav = [
  { label: "Experiences", href: "#experiences" },
  { label: "Destinations", href: "#destinations" },
  { label: "How it works", href: "#process" },
  { label: "Plan a trip", href: "#enquire" },
];

const experiences = [
  {
    icon: Heart,
    title: "Honeymoons & Romance",
    text: "Private villas, sunset dinners and slow mornings, designed for two.",
  },
  {
    icon: Compass,
    title: "Safari & Bush",
    text: "Lodges in the Kruger, Sabi Sands and Okavango, matched to your pace.",
  },
  {
    icon: Globe2,
    title: "International Escapes",
    text: "City breaks and island hops, with visas, flights and transfers handled.",
  },
  {
    icon: Sparkles,
    title: "Group & Celebration Trips",
    text: "Birthdays, girls' trips and family milestones, planned end to end.",
  },
];

const destinations = [
  {
    name: "Zanzibar",
    region: "Tanzania",
    nights: "7 nights",
    from: "R18 900",
    img: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Mauritius",
    region: "Indian Ocean",
    nights: "6 nights",
    from: "R24 500",
    img: "https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Cape Winelands",
    region: "Western Cape",
    nights: "3 nights",
    from: "R8 400",
    img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Bali",
    region: "Indonesia",
    nights: "10 nights",
    from: "R32 000",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Kruger Safari",
    region: "Mpumalanga",
    nights: "4 nights",
    from: "R14 200",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Dubai",
    region: "UAE",
    nights: "5 nights",
    from: "R21 750",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=70",
  },
];

const steps = [
  {
    n: "01",
    title: "Tell us your dream",
    text: "Share your dates, budget and the feeling you want the trip to have.",
  },
  {
    n: "02",
    title: "We curate",
    text: "Receive a tailored itinerary with hand-picked stays and experiences.",
  },
  {
    n: "03",
    title: "Refine & book",
    text: "Tweak until it's perfect. We secure flights, stays and transfers.",
  },
  {
    n: "04",
    title: "Travel well",
    text: "Go with a digital itinerary and support while you're away.",
  },
];

const testimonials = [
  {
    quote: "Every detail was taken care of. We just had to show up and enjoy Zanzibar.",
    name: "Thandi M.",
    trip: "Honeymoon, Zanzibar",
  },
  {
    quote: "Planning a group trip for twelve felt impossible until we found The Travel Curator.",
    name: "Lerato K.",
    trip: "40th birthday, Mauritius",
  },
  {
    quote: "Honest advice, great value and a trip we'll talk about for years.",
    name: "Sipho & Naledi",
    trip: "Family safari, Kruger",
  },
];

function TravelCurator() {
  const [open, setOpen] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    toast.success(`Thanks ${data.get("name") || ""}! We'll be in touch within 24 hours.`);
    form.reset();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-white"
              style={{ background: terracotta }}
            >
              <Plane className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg tracking-wide">
              The Travel Curator <span style={{ color: terracotta }}>ZA</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#enquire"
              className="rounded-full px-5 py-2 text-white"
              style={{ background: terracotta }}
            >
              Enquire
            </a>
          </nav>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t px-4 py-3 md:hidden">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2 text-sm">
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=70"
          alt="Turquoise ocean and white sand beach"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(90deg, ${ocean} 10%, transparent 85%)`,
            opacity: 0.85,
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-36">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/80">
            Bespoke travel · Proudly South African
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-4xl font-light leading-tight text-white sm:text-6xl">
            Journeys curated around you.
          </h1>
          <p className="mt-5 max-w-lg text-white/80">
            From island escapes to bush getaways, we design trips that feel effortless, so you can
            simply arrive and enjoy.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#enquire"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: terracotta }}
            >
              Plan my trip <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#destinations"
              className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Explore destinations
            </a>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section id="experiences" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="What we do" title="Travel, thoughtfully designed" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((e) => (
            <div
              key={e.title}
              className="rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: sand, color: terracotta }}
              >
                <e.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold">{e.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" style={{ background: sand }}>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Featured getaways" title="Where to next?" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <article key={d.name} className="group overflow-hidden rounded-2xl bg-card shadow-sm">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={d.img}
                    alt={d.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-end justify-between p-5">
                  <div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {d.region} · {d.nights}
                    </p>
                    <h3 className="mt-1 font-serif text-xl">{d.name}</h3>
                  </div>
                  <p className="text-right text-xs text-muted-foreground">
                    from
                    <span className="block text-base font-semibold" style={{ color: terracotta }}>
                      {d.from}
                    </span>
                    pp
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Sample prices per person sharing; subject to availability and exchange rates.
          </p>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="How it works" title="From daydream to departure" />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n}>
              <span className="font-serif text-4xl" style={{ color: terracotta }}>
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Testimonials */}
      <section className="text-white" style={{ background: ocean }}>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Kind words" title="Loved by our travellers" light />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <div className="flex gap-0.5" style={{ color: "oklch(0.82 0.13 80)" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-white/85">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="block text-xs text-white/60">{t.trip}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section
        id="enquire"
        className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2"
      >
        <div>
          <SectionHeading
            eyebrow="Start planning"
            title="Let's curate your next trip"
            align="left"
          />
          <p className="mt-5 text-muted-foreground">
            Tell us a little about what you have in mind and we'll come back with ideas within 24
            hours. No obligation.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4" style={{ color: terracotta }} /> WhatsApp: +27 00
              000 0000
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4" style={{ color: terracotta }} />{" "}
              hello@thetravelcuratorza.com
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="h-4 w-4" style={{ color: terracotta }} /> @thetravelcuratorza
            </li>
          </ul>
        </div>
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:grid-cols-2"
        >
          <Field label="Full name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Destination(s)" name="destination" placeholder="e.g. Zanzibar" />
          <Field label="Travel dates" name="dates" placeholder="e.g. Dec 2026" />
          <Field label="Travellers" name="travellers" type="number" min={1} defaultValue="2" />
          <label className="text-sm">
            <span className="mb-1.5 block font-medium">Budget pp</span>
            <select
              name="budget"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option>Under R15 000</option>
              <option>R15 000 – R30 000</option>
              <option>R30 000 – R50 000</option>
              <option>R50 000+</option>
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-medium">Tell us more</span>
            <textarea
              name="message"
              rows={4}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Occasion, travel style, must-haves…"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium text-white sm:col-span-2"
            style={{ background: terracotta }}
          >
            Send enquiry <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} The Travel Curator ZA. All rights reserved.</p>
          <p>Curated journeys · Johannesburg, South Africa</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  light,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p
        className="text-xs font-medium uppercase tracking-[0.25em]"
        style={{ color: light ? "oklch(0.82 0.13 80)" : terracotta }}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-light sm:text-4xl">{title}</h2>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      <input {...props} className="h-10 w-full rounded-md border bg-background px-3 text-sm" />
    </label>
  );
}

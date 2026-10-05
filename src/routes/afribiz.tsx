import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Box,
  Camera,
  CloudCog,
  Cpu,
  Database,
  FileCheck2,
  Globe,
  Instagram,
  Layers,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Mic,
  Network,
  Palette,
  Phone,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
  Trophy,
  TrendingUp,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { AfriChat, Waveform, openAfriChat } from "@/components/afribiz/AfriChat";
import { Logo, LogoMark } from "@/components/afribiz/Logo";
import { awards, clients, company, intro, pillars, stats, team, tiers } from "@/lib/afribiz-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/afribiz")({
  head: () => ({
    meta: [
      { title: "Afribiz Connect — Urbanisation & Development Through Technology" },
      {
        name: "description",
        content:
          "Multi-award-winning South African digital software and marketing agency: AI & chatbots, web and app development, data engineering, SEO, branding and more.",
      },
      { property: "og:title", content: "Afribiz Connect" },
      { property: "og:description", content: "Urbanisation & Development Through Technology." },
      { name: "theme-color", content: "#050816" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Sora:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  component: AfribizPage,
});

const serviceIcons: Record<string, LucideIcon> = {
  "Graphic Design": Palette,
  "Brand Photography": Camera,
  "Brand Videography": Video,
  "Social Media Management": Share2,
  "Google Packages": BadgeCheck,
  "Business Registration": FileCheck2,
  "Website Development": Globe,
  "Digital Audit & Strategy": TrendingUp,
  SEO: Search,
  "AI & Chatbot Solutions": Bot,
  "Cloud Data Pipeline Engineering": CloudCog,
  Cybersecurity: ShieldCheck,
  "Brand Architecture & Brand Style Guides": Layers,
  "App Development": Smartphone,
  "CRM System Implementation": Users,
  "PR & Events": Megaphone,
  "3D Mapping": Box,
};

const pillarIcons = [Network, Database, Cpu, MapPin];

const accentColor = {
  orange: "var(--afz-orange)",
  pink: "var(--afz-pink)",
  teal: "var(--afz-teal)",
} as const;

const nav = [
  { href: "#services", label: "Services" },
  { href: "#ai", label: "AI" },
  { href: "#awards", label: "Awards" },
  { href: "#clients", label: "Clients" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

/* ---------- helpers ---------- */

function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    el.querySelectorAll(".afz-reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [root]);
}

function delay(ms: number) {
  return { "--d": `${ms}ms` } as CSSProperties;
}

/** Tracks the pointer inside a card so .afz-spot can draw a soft spotlight. */
function spotlight(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1600);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  center,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p
        className={cn(
          "afz-reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white/70",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--afz-orange)]" />
        {eyebrow}
      </p>
      <h2
        className="afz-reveal font-display mt-5 text-3xl font-bold leading-[1.1] text-white sm:text-5xl"
        style={delay(80)}
      >
        {title}
      </h2>
      {body && (
        <p
          className="afz-reveal mt-5 text-base leading-relaxed text-[var(--afz-muted)] sm:text-lg"
          style={delay(160)}
        >
          {body}
        </p>
      )}
    </div>
  );
}

/* ---------- page ---------- */

function AfribizPage() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className="afz relative min-h-screen overflow-x-clip">
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <AiSection />
        <Awards />
        <Clients />
        <Team />
        <Contact />
      </main>
      <Footer />
      <AfriChat />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6">
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500",
          scrolled || open ? "afz-glass" : "border border-transparent",
        )}
      >
        <a href="#top" aria-label="Afribiz Connect home">
          <Logo />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="rounded-xl px-3.5 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openAfriChat(true)}
            className="hidden items-center gap-2 rounded-xl border border-white/15 px-3.5 py-2 text-sm text-white/90 transition-colors hover:bg-white/[0.07] sm:inline-flex"
          >
            <Mic className="h-4 w-4 text-[var(--afz-teal)]" /> Talk to Afri
          </button>
          <a
            href="#contact"
            className="afz-btn-primary hidden rounded-xl px-4 py-2 text-sm font-medium text-white sm:inline-flex"
          >
            Start a project
          </a>
          <button
            type="button"
            className="rounded-xl p-2 text-white lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="afz-glass afz-pop mx-auto mt-2 max-w-7xl rounded-2xl p-2 lg:hidden">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-white/85 hover:bg-white/[0.06]"
            >
              {n.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openAfriChat(true);
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-white/85 hover:bg-white/[0.06]"
          >
            <Mic className="h-4 w-4 text-[var(--afz-teal)]" /> Talk to Afri
          </button>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/afribiz/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-35"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/70 via-[#050816]/80 to-[#050816]" />
        <div className="afz-grid-bg absolute inset-0" />
        <div className="afz-orb left-[-10%] top-[10%] h-[420px] w-[420px] bg-[#e9286a]/50" />
        <div
          className="afz-orb right-[-8%] top-[30%] h-[460px] w-[460px] bg-[#f39233]/40"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="afz-orb bottom-[-20%] left-[35%] h-[380px] w-[380px] bg-[#35d6c3]/25"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <a
            href="#awards"
            className="afz-reveal group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] py-1.5 pl-1.5 pr-4 text-xs text-white/80 backdrop-blur transition-colors hover:border-white/25"
          >
            <span className="rounded-full bg-gradient-to-r from-[#f39233] to-[#e9286a] px-2.5 py-1 font-semibold text-white">
              2025
            </span>
            Best Software & Marketing Agency in Africa
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1
            className="afz-reveal font-display mt-7 text-[2.6rem] font-extrabold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
            style={delay(90)}
          >
            How can we <span className="afz-text-gradient afz-shimmer">revolutionize</span> your
            business?
          </h1>

          <p
            className="afz-reveal mt-6 max-w-xl text-lg leading-relaxed text-[var(--afz-muted)]"
            style={delay(180)}
          >
            {company.tagline}. We fuse Information Systems Architecture, Data Engineering and AI
            with deep local expertise to build the structural, intelligent and visual framework for
            your future success.
          </p>

          <div className="afz-reveal mt-9 flex flex-wrap items-center gap-3" style={delay(260)}>
            <a
              href="#contact"
              className="afz-btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-medium text-white"
            >
              Start a project <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => openAfriChat(true)}
              className="afz-glass inline-flex items-center gap-3 rounded-2xl px-5 py-3.5 text-[15px] text-white transition-transform hover:-translate-y-0.5"
            >
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#35d6c3]/15">
                <Mic className="h-4 w-4 text-[var(--afz-teal)]" />
              </span>
              Talk to our AI
            </button>
          </div>

          <div className="afz-reveal mt-12" style={delay(340)}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              Accredited affiliate of
            </p>
            <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
              {company.affiliates.map((a) => (
                <span key={a} className="font-display text-base font-semibold text-white/70">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        <HeroConsole />
      </div>

      {/* Stats */}
      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <dl className="afz-glass grid grid-cols-2 divide-white/10 rounded-3xl lg:grid-cols-4 lg:divide-x">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="afz-reveal flex flex-col px-6 py-7 text-center sm:py-8"
              style={delay(i * 90)}
            >
              <dt className="order-2 mt-1 text-sm text-[var(--afz-muted)]">{s.label}</dt>
              <dd className="font-display order-1 text-4xl font-bold text-white sm:text-5xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Decorative preview of the assistant; clicking it opens the real one in voice mode. */
function HeroConsole() {
  return (
    <div className="afz-reveal relative mx-auto w-full max-w-md lg:max-w-none" style={delay(200)}>
      <div className="afz-float">
        <div className="afz-glass afz-ring relative overflow-hidden rounded-[2rem] p-6">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e9286a]/25 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[var(--afz-teal)] shadow-[0_0_12px_var(--afz-teal)]" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                Afri · Live AI
              </span>
            </div>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/55">
              Voice + Text
            </span>
          </div>

          <div className="relative mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => openAfriChat(true)}
              className="group relative flex h-36 w-36 items-center justify-center rounded-full"
              aria-label="Start talking to Afri"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e9286a] to-[#f39233] opacity-25 blur-xl transition-opacity group-hover:opacity-50" />
              <span className="absolute inset-2 rounded-full border border-white/10 bg-[#0b1130]/80" />
              <LogoMark className="relative h-20 w-20" spin />
            </button>
          </div>
          <div className="mt-5 flex justify-center">
            <Waveform active bars={14} className="h-8" />
          </div>
          <p className="mt-3 text-center text-sm text-white/55">Tap the orb and ask anything</p>

          <div className="relative mt-7 space-y-3">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#e9286a] to-[#f39233] px-4 py-2.5 text-sm text-white">
              Can you build a chatbot for my business?
            </div>
            <div className="flex gap-2.5">
              <LogoMark className="mt-0.5 h-6 w-6" />
              <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white/85">
                Yes. Our AI & Chatbot Solutions team builds voice and text assistants like me,
                trained on your business.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title={
              <>
                Technology with <span className="afz-text-gradient">deep local roots</span>
              </>
            }
          />
          <p
            className="afz-reveal mt-6 text-lg leading-relaxed text-[var(--afz-muted)]"
            style={delay(160)}
          >
            {intro}
          </p>
          <p
            className="afz-reveal mt-4 text-lg leading-relaxed text-[var(--afz-muted)]"
            style={delay(220)}
          >
            We hold a proud commitment to SMMEs and local businesses, particularly within South
            African townships, providing full support and practical training to ensure long-term
            success.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((p, i) => {
            const Icon = pillarIcons[i];
            return (
              <article
                key={p.title}
                onPointerMove={spotlight}
                className="afz-reveal afz-glass afz-ring afz-spot rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
                style={delay(i * 90)}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    background: [
                      "linear-gradient(135deg,#f39233,#e9286a)",
                      "linear-gradient(135deg,#35d6c3,#6150e0)",
                      "linear-gradient(135deg,#e9286a,#6150e0)",
                      "linear-gradient(135deg,#f39233,#35d6c3)",
                    ][i],
                  }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display mt-5 text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--afz-muted)]">{p.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="afz-orb right-[-15%] top-[20%] h-[420px] w-[420px] bg-[#6150e0]/25" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          center
          eyebrow="Our services"
          title={
            <>
              Everything your brand needs for{" "}
              <span className="afz-text-gradient">digital dominance</span>
            </>
          }
          body="Three tiers of capability, from the essentials that launch a brand to the intelligent systems that scale it."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {tiers.map((t, ti) => (
            <article
              key={t.tier}
              onPointerMove={spotlight}
              className={cn(
                "afz-reveal afz-glass afz-ring afz-spot relative flex flex-col overflow-hidden rounded-[1.75rem] p-7",
              )}
              style={delay(ti * 110)}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor[t.accent]}, transparent)`,
                }}
              />
              <div className="flex items-baseline justify-between">
                <span
                  className="font-display text-sm font-bold uppercase tracking-[0.2em]"
                  style={{ color: accentColor[t.accent] }}
                >
                  {t.tier}
                </span>
                <span className="text-xs text-white/45">{t.services.length} services</span>
              </div>
              <h3 className="font-display mt-2 text-2xl font-semibold text-white">{t.label}</h3>
              <ul className="mt-6 space-y-2">
                {t.services.map((s) => {
                  const Icon = serviceIcons[s.name] ?? Layers;
                  return (
                    <li
                      key={s.name}
                      className="group flex items-center gap-3.5 rounded-2xl border border-transparent px-2 py-2.5 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-white/20"
                        style={{ color: accentColor[t.accent] }}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] text-white/90">{s.name}</span>
                        {s.note && <span className="block text-xs text-white/45">{s.note}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() =>
                  openAfriChat(
                    false,
                    `Tell me about your ${t.tier} ${t.label.toLowerCase()} services. Which would suit my business?`,
                  )
                }
                className="group mt-auto flex items-center gap-2 pt-6 text-sm text-white/60 transition-colors hover:text-white"
              >
                Ask Afri about {t.tier}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiSection() {
  const items = [
    {
      icon: Bot,
      title: "Voice & text chatbots",
      body: "Assistants that answer customers 24/7 in natural language.",
    },
    {
      icon: CloudCog,
      title: "Cloud data pipelines",
      body: "Scalable infrastructure on AWS & Apache Spark.",
    },
    {
      icon: ShieldCheck,
      title: "Security by design",
      body: "Systems and client data kept impenetrable.",
    },
  ];
  return (
    <section id="ai" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="afz-glass afz-ring relative overflow-hidden rounded-[2.25rem] px-6 py-14 sm:px-12 lg:px-16">
          <div className="afz-grid-bg absolute inset-0 opacity-70" />
          <div className="afz-orb -left-24 -top-24 h-80 w-80 bg-[#35d6c3]/25" />
          <div
            className="afz-orb -bottom-24 right-0 h-80 w-80 bg-[#e9286a]/30"
            style={{ animationDelay: "-8s" }}
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Intelligence built in"
                title={
                  <>
                    AI that <span className="afz-text-gradient-cool">listens</span>,{" "}
                    <span className="afz-text-gradient">understands</span> and responds
                  </>
                }
                body="Our AI specialists engineer advanced voice and text chatbots and help structure and streamline your processes. Meet Afri: talk to it right now, from your browser."
              />
              <div className="mt-9 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {items.map((it, i) => (
                  <div
                    key={it.title}
                    className="afz-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    style={delay(200 + i * 80)}
                  >
                    <it.icon className="h-5 w-5 text-[var(--afz-teal)]" />
                    <p className="mt-3 text-sm font-medium text-white">{it.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/55">{it.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="afz-reveal flex flex-col items-center text-center" style={delay(150)}>
              <button
                type="button"
                onClick={() => openAfriChat(true)}
                className="group relative flex h-56 w-56 items-center justify-center rounded-full sm:h-64 sm:w-64"
                aria-label="Talk to Afri with your voice"
              >
                <span className="absolute inset-0 animate-[afz-pulse_2.4s_ease-out_infinite] rounded-full border border-[#e9286a]/50" />
                <span
                  className="absolute inset-0 animate-[afz-pulse_2.4s_ease-out_infinite] rounded-full border border-[#f39233]/40"
                  style={{ animationDelay: "1.2s" }}
                />
                <span className="absolute inset-6 rounded-full bg-gradient-to-br from-[#e9286a] via-[#c33a8c] to-[#f39233] opacity-90 shadow-[0_0_80px_-10px_#e9286a] transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-10 rounded-full bg-[#0a1130]/40 backdrop-blur-sm" />
                <Mic className="relative h-14 w-14 text-white drop-shadow-lg" />
              </button>
              <p className="font-display mt-8 text-xl font-semibold text-white">Tap and speak</p>
              <p className="mt-2 max-w-xs text-sm text-white/55">
                Ask Afri about our services, awards or team. Prefer typing? Use the chat button at
                any time.
              </p>
              <button
                type="button"
                onClick={() => openAfriChat(false)}
                className="mt-5 text-sm text-[var(--afz-teal)] underline-offset-4 hover:underline"
              >
                Open text chat instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Awards() {
  return (
    <section id="awards" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Awards achieved"
            title={
              <>
                Recognised across <span className="afz-text-gradient">three continents</span>
              </>
            }
          />
          <p className="afz-reveal max-w-sm text-[var(--afz-muted)]" style={delay(160)}>
            From Nedbank in South Africa to World Business Outlook in Singapore, our work keeps
            earning international recognition.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((a, i) => (
            <article
              key={a.title}
              onPointerMove={spotlight}
              className="afz-reveal afz-glass afz-ring afz-spot group flex flex-col rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
              style={delay((i % 3) * 90)}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c768] to-[#d48a1f] shadow-[0_8px_24px_-8px_#f39233]">
                  <Trophy className="h-5 w-5 text-[#3a2300]" />
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/65">
                  {a.region}
                </span>
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold leading-snug text-white">
                {a.title}
              </h3>
              <p className="mt-1.5 text-sm text-white/55">{a.detail}</p>
              <p className="mt-auto pt-5 text-xs uppercase tracking-[0.16em] text-[var(--afz-orange)]">
                {a.by}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: string[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div className="afz-marquee overflow-hidden">
      <div
        className="afz-marquee-track flex w-max gap-3 py-1.5"
        style={{
          ["--dur" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((c, i) => (
          <span
            key={`${c}-${i}`}
            aria-hidden={i >= items.length}
            className="font-display whitespace-nowrap rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[15px] font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function Clients() {
  const third = Math.ceil(clients.length / 3);
  return (
    <section id="clients" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          center
          eyebrow="Our clients"
          title={
            <>
              Trusted by <span className="afz-text-gradient">130+ brands</span>
            </>
          }
          body="From household names like Shell, SPAR, PostNet and Engen to the township SMMEs we're proud to grow alongside."
        />
      </div>
      <div className="afz-reveal mt-14 space-y-3" style={delay(200)}>
        <MarqueeRow items={clients.slice(0, third)} duration={90} />
        <MarqueeRow items={clients.slice(third, third * 2)} duration={100} reverse />
        <MarqueeRow items={clients.slice(third * 2)} duration={95} />
      </div>
    </section>
  );
}

function Team() {
  const [active, setActive] = useState(0);
  const group = team[active];
  const color = accentColor[group.accent];

  return (
    <section id="team" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="afz-orb left-[-12%] top-[30%] h-[420px] w-[420px] bg-[#e9286a]/20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          center
          eyebrow="The powerhouse"
          title={
            <>
              Meet the <span className="afz-text-gradient">Afribiz Connect</span> team
            </>
          }
          body="A dynamic team of innovators driving urbanisation and development through technology."
        />

        <div className="afz-reveal mt-12 flex justify-center" style={delay(200)}>
          <div
            role="tablist"
            aria-label="Team groups"
            className="afz-glass inline-flex flex-wrap justify-center gap-1 rounded-2xl p-1.5"
          >
            {team.map((g, i) => (
              <button
                key={g.name}
                role="tab"
                type="button"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm transition-all duration-300",
                  i === active
                    ? "bg-white/[0.1] text-white shadow-inner"
                    : "text-white/55 hover:text-white",
                )}
              >
                {g.name.replace(/^The /, "")}
              </button>
            ))}
          </div>
        </div>

        <div
          key={active}
          role="tabpanel"
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {group.members.map((m, i) => (
            <article
              key={m.name}
              onPointerMove={spotlight}
              className="afz-glass afz-ring afz-spot afz-pop group rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full p-[2px] transition-transform duration-500 group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${color}, transparent 70%)` }}
                >
                  <img
                    src={m.photo}
                    alt={m.name}
                    loading="lazy"
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] rounded-full bg-white object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color }}
                  >
                    {m.title}
                  </p>
                  <h3 className="font-display mt-1 text-lg font-semibold text-white">{m.name}</h3>
                  <p className="text-sm text-white/55">{m.role}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--afz-muted)]">{m.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Project enquiry${form.service ? ` — ${form.service}` : ""}${form.company ? ` (${form.company})` : ""}`;
    const body = `Hi Afribiz Connect,\n\n${form.message}\n\n${form.name}\n${form.email}${form.company ? `\n${form.company}` : ""}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/35 transition-colors focus:border-[var(--afz-orange)] focus:bg-white/[0.06] focus:outline-none";

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title={
              <>
                Let's build what's <span className="afz-text-gradient">next</span>
              </>
            }
            body="Tell us about your business and we'll recommend the right mix of services, with a quote after a short consultation."
          />
          <div className="mt-10 space-y-3">
            {[
              { icon: Phone, label: "Call us", value: company.phone, href: company.phoneHref },
              {
                icon: Mail,
                label: "Email us",
                value: company.email,
                href: `mailto:${company.email}`,
              },
              ...company.socials.map((s) => ({
                icon: Instagram,
                label: s.name,
                value: s.handle,
                href: s.href,
              })),
            ].map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="afz-reveal afz-glass afz-ring group flex items-center gap-4 rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
                style={delay(200 + i * 80)}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f39233] to-[#e9286a]">
                  <c.icon className="h-5 w-5 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs uppercase tracking-[0.16em] text-white/45">
                    {c.label}
                  </span>
                  <span className="block truncate text-[15px] text-white">{c.value}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="afz-reveal afz-glass afz-ring rounded-[2rem] p-6 sm:p-9"
          style={delay(150)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-white/70">Name</span>
              <input
                required
                value={form.name}
                onChange={set("name")}
                className={field}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-white/70">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                className={field}
                placeholder="you@company.co.za"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-white/70">Company</span>
              <input
                value={form.company}
                onChange={set("company")}
                className={field}
                placeholder="Optional"
                autoComplete="organization"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-white/70">Service</span>
              <select
                value={form.service}
                onChange={set("service")}
                className={cn(field, "appearance-none")}
              >
                <option value="" className="bg-[#0a1130]">
                  Not sure yet
                </option>
                {tiers.flatMap((t) =>
                  t.services.map((s) => (
                    <option key={s.name} value={s.name} className="bg-[#0a1130]">
                      {s.name}
                    </option>
                  )),
                )}
              </select>
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm text-white/70">How can we help?</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={set("message")}
              className={cn(field, "resize-none")}
              placeholder="Tell us about your goals…"
            />
          </label>
          <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => openAfriChat(false)}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Have a quick question? <span className="text-[var(--afz-teal)]">Ask Afri</span>
            </button>
            <button
              type="submit"
              className="afz-btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-medium text-white"
            >
              Send enquiry <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 pb-28 pt-14 sm:pb-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-white/50">{company.tagline}.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div>
            <p className="font-medium text-white">Explore</p>
            <ul className="mt-3 space-y-2 text-white/55">
              {nav.slice(0, 4).map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-white/55">
              <li>
                <a href={company.phoneHref} className="hover:text-white">
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="break-all hover:text-white">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-white">Affiliates</p>
            <ul className="mt-3 space-y-2 text-white/55">
              {company.affiliates.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-4 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Afribiz Connect. All rights reserved.</p>
        <p>Company Reg {company.registration}</p>
      </div>
    </footer>
  );
}

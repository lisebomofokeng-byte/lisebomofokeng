import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Landmark,
  Send,
  Loader2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  CircleDashed,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/capfin")({
  head: () => ({
    meta: [
      { title: "Capfin Loan Assistant" },
      { name: "description", content: "Chat with Capfin about your loan, installments and schedule." },
    ],
  }),
  component: CapfinPage,
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

// Demo loan data — would be fetched from backend in production.
const LOAN = {
  accountNumber: "CF-4827-9931",
  customerName: "Valued Customer",
  currency: "ZAR",
  loanAmount: 24000,
  termMonths: 12,
  interestRate: 0.21,
  monthlyInstallment: 2240,
  startMonthIndex: 0, // January
  paidThroughMonthIndex: 4, // Jan–May paid (index 4 = May)
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: LOAN.currency,
    maximumFractionDigits: 2,
  }).format(n);
}

function CapfinPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const schedule = useMemo(() => {
    const totalRepayable = LOAN.monthlyInstallment * LOAN.termMonths;
    return MONTHS.map((month, i) => {
      let status: "paid" | "next" | "upcoming" = "upcoming";
      if (i <= LOAN.paidThroughMonthIndex) status = "paid";
      else if (i === LOAN.paidThroughMonthIndex + 1) status = "next";
      const remainingAfter = Math.max(totalRepayable - LOAN.monthlyInstallment * (i + 1), 0);
      return { month, index: i, status, amount: LOAN.monthlyInstallment, remainingAfter };
    });
  }, []);

  const lastInstallment = schedule.filter((s) => s.status === "paid").slice(-1)[0];
  const nextInstallment = schedule.find((s) => s.status === "next");
  const totalRepayable = LOAN.monthlyInstallment * LOAN.termMonths;
  const paidSoFar = LOAN.monthlyInstallment * (LOAN.paidThroughMonthIndex + 1);
  const outstanding = totalRepayable - paidSoFar;
  const progress = Math.round((paidSoFar / totalRepayable) * 100);

  const loanContext = {
    ...LOAN,
    months: MONTHS,
    schedule: schedule.map((s) => ({
      month: s.month,
      status: s.status,
      installment: s.amount,
    })),
    lastInstallment: lastInstallment
      ? { month: lastInstallment.month, amount: lastInstallment.amount }
      : null,
    nextInstallment: nextInstallment
      ? { month: nextInstallment.month, amount: nextInstallment.amount }
      : null,
    totalRepayable,
    paidSoFar,
    outstanding,
  };

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/capfin-chat",
        body: { loan: loanContext },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  const quickPrompts = [
    "What is my next installment?",
    "Show me the full 12-month schedule.",
    "How much do I still owe?",
    "Can I settle the loan early?",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <PageHeader
        icon={<Landmark className="h-5 w-5" />}
        title="Capfin Loan Assistant"
        description="Track your loan, see all 12 monthly installments, and chat with our assistant."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: loan summary + schedule */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Loan amount" value={fmt(LOAN.loanAmount)} sub={`${LOAN.termMonths} months`} />
            <SummaryCard label="Monthly installment" value={fmt(LOAN.monthlyInstallment)} sub={`@ ${(LOAN.interestRate * 100).toFixed(0)}% p.a.`} />
            <SummaryCard
              label="Last installment"
              value={lastInstallment ? fmt(lastInstallment.amount) : "—"}
              sub={lastInstallment ? `Paid · ${lastInstallment.month}` : "None yet"}
              tone="success"
            />
            <SummaryCard
              label="Next installment"
              value={nextInstallment ? fmt(nextInstallment.amount) : "—"}
              sub={nextInstallment ? `Due · ${nextInstallment.month}` : "Settled"}
              tone="primary"
            />
          </div>

          {/* Progress */}
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">Repayment progress</p>
                <p className="text-muted-foreground">
                  {fmt(paidSoFar)} of {fmt(totalRepayable)} repaid
                </p>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{progress}%</p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: "var(--gradient-primary)" }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Outstanding balance: <span className="font-medium text-foreground">{fmt(outstanding)}</span>
            </p>
          </div>

          {/* 12-month schedule */}
          <div className="rounded-xl border bg-card shadow-[var(--shadow-soft)]">
            <div className="border-b px-5 py-4">
              <h2 className="text-sm font-semibold">12-Month Installment Schedule</h2>
              <p className="text-xs text-muted-foreground">Account {LOAN.accountNumber}</p>
            </div>
            <ul className="divide-y">
              {schedule.map((row) => (
                <li key={row.month} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={row.status} />
                    <div>
                      <p className="font-medium">{row.month}</p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {row.status === "paid" ? "Paid" : row.status === "next" ? "Next due" : "Upcoming"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium tabular-nums">{fmt(row.amount)}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Bal. after: {fmt(row.remainingAfter)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column: chat */}
        <div className="lg:col-span-1">
          <div className="flex h-[calc(100vh-12rem)] min-h-[520px] flex-col rounded-xl border bg-card shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Landmark className="h-4 w-4" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Capfin Assistant</p>
                  <p className="text-[11px] text-muted-foreground">Online · replies instantly</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMessages([])}
                disabled={!messages.length}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
                    Hi! I'm your Capfin assistant. Ask me about your installments, schedule
                    or balance.
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {quickPrompts.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage({ text: q })}
                        className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      {isUser ? (
                        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                          {text}
                        </div>
                      ) : (
                        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
                          <article className="prose prose-sm max-w-none prose-p:my-1 prose-headings:font-semibold prose-pre:bg-background prose-code:text-foreground">
                            <ReactMarkdown>{text || "…"}</ReactMarkdown>
                          </article>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Assistant is typing…
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t p-3">
              <div className="flex items-end gap-2 rounded-xl border bg-background p-2 focus-within:border-primary/40">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your loan…"
                  className="min-h-[40px] flex-1 resize-none border-0 bg-transparent p-1.5 text-sm shadow-none focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit();
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                AI responses are indicative. Always confirm with your official Capfin statement.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "primary" | "success";
}) {
  const accent =
    tone === "primary"
      ? "text-primary"
      : tone === "success"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-foreground";
  return (
    <div className="rounded-xl border bg-card p-4 shadow-[var(--shadow-soft)]">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold tracking-tight ${accent}`}>{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function StatusIcon({ status }: { status: "paid" | "next" | "upcoming" }) {
  if (status === "paid")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "next") return <Clock className="h-4 w-4 text-primary" />;
  return <CircleDashed className="h-4 w-4 text-muted-foreground" />;
}
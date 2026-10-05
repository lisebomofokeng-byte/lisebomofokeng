import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowUp,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";

export const OPEN_CHAT_EVENT = "afribiz:open-chat";

/**
 * Open the assistant from anywhere on the page. `voice` starts listening straight away;
 * `prompt` sends that question on the visitor's behalf.
 */
export function openAfriChat(voice = false, prompt?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { voice, prompt } }));
}

const suggestions = [
  "Which services suit a new township business?",
  "Can you build us an AI voice chatbot?",
  "What awards has Afribiz Connect won?",
  "How do I get a quote?",
];

function toSpeech(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[*_#>`~]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^\s*[-•]\s+/gm, "")
    .trim();
}

export function Waveform({
  active,
  bars = 5,
  className,
}: {
  active: boolean;
  bars?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("afz-wave flex h-6 items-center gap-[3px]", !active && "is-idle", className)}
      aria-hidden="true"
    >
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} style={{ ["--i" as string]: i }} />
      ))}
    </div>
  );
}

export function AfriChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [readAloud, setReadAloud] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Whether the reply in flight answers a spoken question, so it should be spoken back.
  const voiceTurnRef = useRef(false);

  const { messages, sendMessage, status, setMessages, stop, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/afribiz-chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  const tts = useSpeechSynthesis();

  const send = useCallback(
    (text: string, voice = false) => {
      const t = text.trim();
      if (!t || busy) return;
      voiceTurnRef.current = voice;
      tts.cancel();
      clearError();
      setInput("");
      void sendMessage({ text: t }, { body: { voice: voice || readAloud } });
    },
    [busy, clearError, readAloud, sendMessage, tts],
  );

  const stt = useSpeechRecognition((text) => send(text, true));

  // Open requests from the rest of the page.
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    const handler = (e: Event) => {
      const { voice, prompt } =
        (e as CustomEvent<{ voice?: boolean; prompt?: string }>).detail ?? {};
      setOpen(true);
      if (prompt) sendRef.current(prompt);
      else if (voice) setTimeout(stt.start, 250);
    };
    window.addEventListener(OPEN_CHAT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handler);
  }, [stt.start]);

  // Speak the finished reply for voice turns, or always when read-aloud is on.
  const prevStatus = useRef(status);
  useEffect(() => {
    if (
      prevStatus.current === "streaming" &&
      status === "ready" &&
      (voiceTurnRef.current || readAloud)
    ) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") {
        tts.speak(toSpeech(last.parts.map((p) => (p.type === "text" ? p.text : "")).join("")));
      }
    }
    prevStatus.current = status;
  }, [status, messages, readAloud, tts]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, stt.interim]);

  useEffect(() => {
    if (!open) {
      stt.stop();
      tts.cancel();
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleMic = () => {
    if (stt.listening) stt.stop();
    else {
      tts.cancel();
      stt.start();
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Afri assistant" : "Open Afri assistant"}
        aria-expanded={open}
        className={cn(
          "afz-btn-primary fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2.5 rounded-full pl-2 pr-5 text-sm font-medium text-white sm:bottom-7 sm:right-7",
          open && "pr-2",
        )}
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/25">
          {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          {!open && (
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#e9286a] bg-[#35d6c3]" />
          )}
        </span>
        {!open && <span className="hidden sm:inline">Ask Afri</span>}
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Afri, the Afribiz Connect AI assistant"
          className="afz-glass-strong afz-pop fixed inset-x-3 bottom-24 top-20 z-50 flex flex-col overflow-hidden rounded-3xl sm:inset-x-auto sm:right-7 sm:top-auto sm:h-[min(640px,calc(100vh-9rem))] sm:w-[400px]"
        >
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                <LogoMark className="h-7 w-7" spin={busy || tts.speaking} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1130] bg-[#35d6c3]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-white">Afri</p>
              <p className="truncate text-xs text-[var(--afz-muted)]">
                {stt.listening
                  ? "Listening…"
                  : tts.speaking
                    ? "Speaking…"
                    : busy
                      ? "Thinking…"
                      : "AI assistant · Afribiz Connect"}
              </p>
            </div>
            {tts.supported && (
              <button
                type="button"
                onClick={() => {
                  if (readAloud) tts.cancel();
                  setReadAloud((r) => !r);
                }}
                className={cn(
                  "rounded-xl p-2 transition-colors hover:bg-white/10",
                  readAloud ? "text-[var(--afz-teal)]" : "text-white/60",
                )}
                aria-pressed={readAloud}
                title={readAloud ? "Stop reading replies aloud" : "Read replies aloud"}
              >
                {readAloud ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                tts.cancel();
                setMessages([]);
                clearError();
              }}
              disabled={!messages.length}
              className="rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 disabled:opacity-30"
              title="New conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
            aria-live="polite"
          >
            {messages.length === 0 && !stt.listening ? (
              <div className="flex h-full flex-col justify-end">
                <div className="mb-5">
                  <p className="font-display text-xl font-semibold text-white">
                    Hi, I'm <span className="afz-text-gradient">Afri</span>.
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--afz-muted)]">
                    Ask about our services, awards or team, by typing or tapping the mic to talk.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-left text-sm text-white/85 transition-all hover:border-white/25 hover:bg-white/[0.08]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                return m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#e9286a] to-[#f39233] px-3.5 py-2.5 text-sm text-white shadow-lg shadow-pink-900/30">
                      {text}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-2.5">
                    <LogoMark className="mt-0.5 h-6 w-6" />
                    <div className="prose prose-sm prose-invert max-w-[85%] rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-white">
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  </div>
                );
              })
            )}

            {status === "submitted" && (
              <div className="flex items-center gap-2.5 pl-8 text-xs text-[var(--afz-muted)]">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}

            {stt.listening && (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3 rounded-2xl border border-[#e9286a]/40 bg-[#e9286a]/10 px-3.5 py-2.5">
                  <Waveform active />
                  <span className="max-w-[230px] text-sm text-white/90">
                    {stt.interim || "Listening…"}
                  </span>
                </div>
              </div>
            )}

            {(error || stt.error) && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {stt.error ??
                  "Afri couldn't reply just now. Please try again, or reach the team on +27 65 332 1150."}
              </p>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-white/10 p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 transition-colors focus-within:border-white/25">
              {stt.supported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  className={cn(
                    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    stt.listening
                      ? "afz-pulse-ring bg-[#e9286a] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                  aria-label={stt.listening ? "Stop listening" : "Speak to Afri"}
                  aria-pressed={stt.listening}
                >
                  {stt.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={stt.supported ? "Type or tap the mic…" : "Type your question…"}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white"
                  aria-label="Stop response"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="afz-btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white disabled:opacity-40 disabled:shadow-none"
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-2 px-1 text-[10.5px] text-white/40">
              AI answers can be imperfect. Confirm details with the Afribiz team.
            </p>
          </form>
        </section>
      )}
    </>
  );
}

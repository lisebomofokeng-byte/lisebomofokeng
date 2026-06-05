import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AiOutput({
  value,
  onChange,
  placeholder = "AI output will appear here. You can edit it before using.",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [tab, setTab] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex gap-1">
          {(["preview", "edit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={copy} disabled={!value}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="min-h-[280px] p-4">
        {tab === "preview" ? (
          value ? (
            <article className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-muted prose-code:text-foreground">
              <ReactMarkdown>{value}</ReactMarkdown>
            </article>
          ) : (
            <p className="text-sm text-muted-foreground">{placeholder}</p>
          )
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[260px] resize-none border-0 p-0 shadow-none focus-visible:ring-0"
          />
        )}
      </div>
      <div className="flex items-start gap-2 border-t bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          AI-generated content may contain errors or omissions. Review and edit before using.
        </span>
      </div>
    </div>
  );
}
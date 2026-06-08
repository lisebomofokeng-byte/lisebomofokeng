import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResponsibleAiNote({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--gold)" }} />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> Estimated
        durations and stylist matching are optimized by AI. Please review final details
        before confirming.
      </p>
    </div>
  );
}
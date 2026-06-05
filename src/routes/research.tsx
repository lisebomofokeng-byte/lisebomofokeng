import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Search, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      { name: "description", content: "Get a structured briefing on any workplace topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"brief" | "standard" | "deep">("standard");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!topic.trim()) return toast.error("Enter a topic.");
    setLoading(true);
    try {
      const { text } = await fn({ data: { topic, depth } });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<Search className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Get a structured briefing covering key concepts, trade-offs, and next steps."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic or question</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Best practices for async standups in distributed teams"
            />
          </div>
          <div className="grid gap-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deep">Deep</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onSubmit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            <span className="ml-2">{loading ? "Researching..." : "Generate briefing"}</span>
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Note: This assistant does not browse the web. Verify facts and cite sources independently.
          </p>
        </div>
        <AiOutput value={output} onChange={setOutput} placeholder="Your briefing will appear here." />
      </div>
    </div>
  );
}
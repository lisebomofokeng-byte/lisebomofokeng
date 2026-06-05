import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListChecks, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      { name: "description", content: "Turn goals into prioritized plans." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("this week");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!goal.trim()) return toast.error("Describe your goal first.");
    setLoading(true);
    try {
      const { text } = await fn({ data: { goal, timeframe } });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        icon={<ListChecks className="h-5 w-5" />}
        title="AI Task Planner"
        description="Describe a goal. We'll break it into milestones and a daily plan."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-2">
            <Label htmlFor="goal">Your goal</Label>
            <Textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Launch the v2 marketing site and prepare a press release."
              className="min-h-[180px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tf">Timeframe</Label>
            <Input
              id="tf"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="e.g. next 2 weeks"
            />
          </div>
          <Button onClick={onSubmit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            <span className="ml-2">{loading ? "Planning..." : "Create plan"}</span>
          </Button>
        </div>
        <AiOutput value={output} onChange={setOutput} placeholder="Your plan will appear here." />
      </div>
    </div>
  );
}
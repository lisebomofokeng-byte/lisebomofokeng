import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      recipient: z.string().max(200).optional().default(""),
      tone: z.string().max(50).default("professional"),
      subject: z.string().max(200).optional().default(""),
      context: z.string().min(1).max(4000),
    }),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert workplace email writer. Produce clear, concise, well-structured emails. Output the email body only, including a subject line as the first line in the format 'Subject: ...'.",
      prompt: `Write an email.\nRecipient: ${data.recipient || "(unspecified)"}\nTone: ${data.tone}\nDesired subject: ${data.subject || "(infer one)"}\nContext / what to say:\n${data.context}`,
    });
    return { text };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(1).max(20000) }))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert meeting analyst. Given raw meeting notes or a transcript, produce a structured markdown summary with sections: ## Summary, ## Key Decisions, ## Action Items (as a checklist with owner if mentioned), ## Open Questions.",
      prompt: data.notes,
    });
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      goal: z.string().min(1).max(2000),
      timeframe: z.string().max(100).default("this week"),
    }),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an AI task planner for busy professionals. Break the goal into a prioritized, realistic plan in markdown with sections: ## Overview, ## Milestones, ## Daily Breakdown (table or list), ## Risks & Mitigations. Use checkboxes for actionable items.",
      prompt: `Goal: ${data.goal}\nTimeframe: ${data.timeframe}`,
    });
    return { text };
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(1).max(1000),
      depth: z.enum(["brief", "standard", "deep"]).default("standard"),
    }),
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a workplace research assistant. Produce a structured markdown briefing with: ## Executive Summary, ## Key Concepts, ## Recent Developments, ## Considerations & Trade-offs, ## Suggested Next Steps. Be factual, cite uncertainty when relevant, and avoid fabricated citations.",
      prompt: `Topic: ${data.topic}\nDepth: ${data.depth}`,
    });
    return { text };
  });
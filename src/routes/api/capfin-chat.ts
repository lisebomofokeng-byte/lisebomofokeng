import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/capfin-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, loan } = (await request.json()) as {
          messages?: UIMessage[];
          loan?: Record<string, unknown>;
        };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: `You are Capfin Assistant, a friendly customer-support chatbot for Capfin, a personal-loan institution. Help customers understand their loan: balance, monthly installments, payment schedule across the 12 months of the year (January–December), the last installment paid, and the next installment due. Be concise, warm, and professional. Always remind customers that figures are indicative and to confirm with their official Capfin statement. Never request full ID numbers, passwords, or card PINs.

The customer's current loan context (JSON):
${JSON.stringify(loan ?? {}, null, 2)}`,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
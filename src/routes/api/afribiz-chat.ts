import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { awards, company, intro, team, tiers } from "@/lib/afribiz-data";

const knowledge = `
COMPANY: ${company.name} — "${company.tagline}". Company reg ${company.registration}.
${intro}
Accredited affiliate of: ${company.affiliates.join(", ")}.
Supports SMMEs and local businesses, particularly in South African townships, with full support and practical training.

SERVICES:
${tiers.map((t) => `${t.tier} (${t.label}): ${t.services.map((s) => s.name).join(", ")}`).join("\n")}

AWARDS:
${awards.map((a) => `- ${a.title} — ${a.detail} (${a.by}, ${a.region})`).join("\n")}

CLIENTS include Shell, SPAR, PostNet, Engen, the Democratic Alliance and 130+ SMMEs and brands.

TEAM:
${team.map((g) => `${g.name}: ${g.members.map((m) => `${m.name} (${m.role})`).join("; ")}`).join("\n")}

CONTACT: phone ${company.phone}, email ${company.email}, Instagram @afribizconnect_.
`;

export const Route = createFileRoute("/api/afribiz-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, voice } = (await request.json()) as {
          messages?: UIMessage[];
          voice?: boolean;
        };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: `You are Afri, the AI assistant on the Afribiz Connect website. Help visitors understand Afribiz Connect's services, recommend the right service tier for their business, and guide them to get in touch. Be warm, confident, and concise (under 120 words unless asked for more). Only state facts from the knowledge below; for pricing or timelines, say the team will quote after a short consultation and share the contact details. Never invent clients, awards, or prices.${
            voice
              ? " The visitor is talking to you by voice and your reply will be read aloud: answer in plain conversational sentences with no markdown, lists, or emoji."
              : " Use light markdown (short lists, bold) where it helps."
          }

KNOWLEDGE:
${knowledge}`,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});

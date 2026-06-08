import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsibleAiNote } from "@/components/ResponsibleAiNote";
import { APPOINTMENTS, getService, getStylist } from "@/lib/salon-data";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Aura Admin" },
      { name: "description", content: "Preview and edit confirmation messages sent to clients." },
    ],
  }),
  component: AdminNotifications,
});

type Tone = "Luxury & Pampering" | "Direct & Professional" | "Casual & Warm";
type Channel = "Email" | "SMS";

function buildMessage(tone: Tone, channel: Channel, appt: typeof APPOINTMENTS[number]) {
  const service = getService(appt.serviceId);
  const stylist = getStylist(appt.stylistId);
  const date = new Date(appt.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const name = appt.clientName.replace(" (You)", "");
  if (channel === "SMS") {
    if (tone === "Luxury & Pampering")
      return `${name}, we can't wait to pamper you ✨ Your ${service.name} with ${stylist.name} is reserved for ${date} at ${appt.startTime}. — Aura`;
    if (tone === "Direct & Professional")
      return `Aura: Booking confirmed — ${service.name} with ${stylist.name}, ${date}, ${appt.startTime}. Reply CANCEL to release.`;
    return `Hey ${name}! 👋 You're booked in with ${stylist.name} on ${date} at ${appt.startTime} for a ${service.name}. See you soon! — Aura`;
  }
  // Email
  if (tone === "Luxury & Pampering")
    return `Dear ${name},\n\nYour seat is reserved.\n\nWe're delighted to welcome you for your ${service.name} with ${stylist.name}, ${stylist.title}, on ${date} at ${appt.startTime}.\n\nA glass of something lovely will be waiting.\n\nWith warmth,\nThe Aura Team`;
  if (tone === "Direct & Professional")
    return `Hello ${name},\n\nThis confirms your appointment at Aura Salon:\n\n• Service: ${service.name}\n• Stylist: ${stylist.name}\n• Date: ${date}\n• Time: ${appt.startTime}\n\nTo reschedule or cancel, reply to this email at least 24 hours in advance.\n\nThank you,\nAura Salon`;
  return `Hi ${name}!\n\nJust a quick note — you're all set for your ${service.name} with ${stylist.name} on ${date} at ${appt.startTime}. We can't wait to see you!\n\nCheers,\nThe Aura crew`;
}

function AdminNotifications() {
  const upcoming = APPOINTMENTS.filter((a) => a.status !== "Completed" && a.status !== "Cancelled");
  const [apptId, setApptId] = useState(upcoming[0].id);
  const [tone, setTone] = useState<Tone>("Luxury & Pampering");
  const [channel, setChannel] = useState<Channel>("Email");
  const [sending, setSending] = useState(false);

  const appt = upcoming.find((a) => a.id === apptId)!;
  const generated = useMemo(() => buildMessage(tone, channel, appt), [tone, channel, appt]);
  const [text, setText] = useState(generated);

  // Sync when controls change
  useMemo(() => setText(generated), [generated]);

  const send = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(`${channel} sent to ${appt.clientName.replace(" (You)", "")}`);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">Client notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preview, edit and send confirmation messages.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Booking">
          <Select value={apptId} onValueChange={setApptId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {upcoming.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.clientName.replace(" (You)", "")} · {getService(a.serviceId).name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Channel">
          <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="SMS">SMS</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Tone">
          <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Luxury & Pampering">Luxury & Pampering</SelectItem>
              <SelectItem value="Direct & Professional">Direct & Professional</SelectItem>
              <SelectItem value="Casual & Warm">Casual & Warm</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-6 rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            {channel === "Email" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            Preview · {channel}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
            <Button size="sm" onClick={send} disabled={sending}>
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send
            </Button>
          </div>
        </div>
        <div className="p-5">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={channel === "Email" ? 12 : 4}
            className="font-mono text-sm"
          />
          <p className="mt-2 text-[11px] text-muted-foreground">Fully editable — your changes ship as-is.</p>
        </div>
      </div>

      <ResponsibleAiNote className="mt-8" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
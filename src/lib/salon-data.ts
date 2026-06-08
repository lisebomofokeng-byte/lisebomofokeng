export type ServiceCategory = "Cut & Style" | "Color" | "Treatment" | "Barbering";

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMin: number;
  description: string;
};

export const SERVICES: Service[] = [
  { id: "cut-style", name: "Cut & Style", category: "Cut & Style", price: 85, durationMin: 60, description: "Precision cut with a signature blow-dry finish." },
  { id: "blowout", name: "Luxury Blowout", category: "Cut & Style", price: 65, durationMin: 45, description: "Smooth, voluminous styling for any occasion." },
  { id: "balayage", name: "Full Balayage", category: "Color", price: 250, durationMin: 180, description: "Hand-painted, sun-kissed dimension." },
  { id: "root-touch", name: "Root Touch-up", category: "Color", price: 110, durationMin: 90, description: "Refresh your base in a single session." },
  { id: "gloss", name: "Shine Gloss Treatment", category: "Treatment", price: 70, durationMin: 45, description: "Adds shine and tones brassiness." },
  { id: "keratin", name: "Keratin Smoothing", category: "Treatment", price: 320, durationMin: 150, description: "Frizz-free, glossy results for months." },
  { id: "barber-cut", name: "Precision Barber Cut", category: "Barbering", price: 55, durationMin: 45, description: "Tailored cut, hot-towel finish." },
  { id: "beard", name: "Beard Sculpt & Shave", category: "Barbering", price: 40, durationMin: 30, description: "Classic shave with luxury detailing." },
];

export type Stylist = {
  id: string;
  name: string;
  title: string;
  tier: "Master" | "Senior" | "Stylist";
  avatarColor: string;
  initials: string;
  bio: string;
};

export const STYLISTS: Stylist[] = [
  { id: "elena", name: "Elena Voss", title: "Master Colorist", tier: "Master", avatarColor: "oklch(0.78 0.11 82)", initials: "EV", bio: "12+ years specializing in dimensional balayage and editorial color." },
  { id: "marcus", name: "Marcus Lane", title: "Precision Barber", tier: "Senior", avatarColor: "oklch(0.35 0.04 250)", initials: "ML", bio: "Sharp lines, classic finishes — trained in London and NYC." },
  { id: "chloe", name: "Chloe Park", title: "Stylist & Texture Expert", tier: "Stylist", avatarColor: "oklch(0.7 0.09 30)", initials: "CP", bio: "Lover of soft layers, curtain bangs, and lived-in color." },
];

export type AppointmentStatus = "Confirmed" | "Pending Deposit" | "Completed" | "Cancelled";

export type Appointment = {
  id: string;
  clientName: string;
  clientEmail: string;
  stylistId: string;
  serviceId: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
};

const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const APPOINTMENTS: Appointment[] = [
  { id: "a1", clientName: "Sarah Mitchell", clientEmail: "sarah@example.com", stylistId: "elena", serviceId: "balayage", date: iso(0), startTime: "09:00", status: "Confirmed", notes: "Prefers cooler tones, allergic to PPD." },
  { id: "a2", clientName: "James Carter", clientEmail: "james@example.com", stylistId: "marcus", serviceId: "barber-cut", date: iso(0), startTime: "10:30", status: "Confirmed" },
  { id: "a3", clientName: "Priya Shah", clientEmail: "priya@example.com", stylistId: "chloe", serviceId: "cut-style", date: iso(0), startTime: "11:00", status: "Pending Deposit", notes: "First visit — wants curtain bangs." },
  { id: "a4", clientName: "Daniel Wu", clientEmail: "daniel@example.com", stylistId: "marcus", serviceId: "beard", date: iso(0), startTime: "13:00", status: "Confirmed" },
  { id: "a5", clientName: "Olivia Bennett", clientEmail: "olivia@example.com", stylistId: "elena", serviceId: "root-touch", date: iso(0), startTime: "14:00", status: "Confirmed" },
  { id: "a6", clientName: "Maya Patel (You)", clientEmail: "you@example.com", stylistId: "elena", serviceId: "gloss", date: iso(3), startTime: "15:30", status: "Confirmed" },
  { id: "a7", clientName: "Maya Patel (You)", clientEmail: "you@example.com", stylistId: "chloe", serviceId: "cut-style", date: iso(10), startTime: "11:00", status: "Pending Deposit" },
  { id: "a8", clientName: "Maya Patel (You)", clientEmail: "you@example.com", stylistId: "elena", serviceId: "balayage", date: iso(-21), startTime: "10:00", status: "Completed" },
  { id: "a9", clientName: "Maya Patel (You)", clientEmail: "you@example.com", stylistId: "chloe", serviceId: "blowout", date: iso(-60), startTime: "16:00", status: "Completed" },
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export function formatPrice(p: number) {
  return `$${p.toFixed(0)}`;
}

export function formatDuration(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id)!;
}

export function getStylist(id: string) {
  return STYLISTS.find((s) => s.id === id)!;
}
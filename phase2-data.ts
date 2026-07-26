import type { VenueId } from "./venues";

export type EventItem = {
  id: string;
  venueId: VenueId;
  title: string;
  date: string;
  time: string;
  category: "Sports" | "Music" | "Tech" | "Culture";
  price: number;
  image: string;
  seatsLeft: number;
  totalSeats: number;
  featured?: boolean;
};

export const EVENTS: EventItem[] = [
  {
    id: "evt-rcb-csk",
    venueId: "chinnaswamy",
    title: "RCB vs CSK — IPL Playoff",
    date: "2026-08-14",
    time: "19:30",
    category: "Sports",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=70",
    seatsLeft: 1240,
    totalSeats: 40000,
    featured: true,
  },
  {
    id: "evt-rcb-mi",
    venueId: "chinnaswamy",
    title: "RCB vs Mumbai Indians",
    date: "2026-08-22",
    time: "19:30",
    category: "Sports",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=70",
    seatsLeft: 8400,
    totalSeats: 40000,
  },
  {
    id: "evt-sunburn-main",
    venueId: "sunburn",
    title: "Sunburn Main Night — Martin Garrix",
    date: "2026-08-16",
    time: "20:00",
    category: "Music",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=70",
    seatsLeft: 320,
    totalSeats: 55000,
    featured: true,
  },
  {
    id: "evt-sunburn-day2",
    venueId: "sunburn",
    title: "Sunburn Day 2 — DJ Snake",
    date: "2026-08-17",
    time: "20:00",
    category: "Music",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=70",
    seatsLeft: 4100,
    totalSeats: 55000,
  },
  {
    id: "evt-iisc-keynote",
    venueId: "iisc",
    title: "IISc Tech Fest — AI Keynote",
    date: "2026-08-19",
    time: "10:00",
    category: "Tech",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=70",
    seatsLeft: 240,
    totalSeats: 1200,
    featured: true,
  },
  {
    id: "evt-iisc-hack",
    venueId: "iisc",
    title: "IISc Hackathon Finals",
    date: "2026-08-20",
    time: "14:00",
    category: "Tech",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=70",
    seatsLeft: 90,
    totalSeats: 500,
  },
];

export type Ticket = {
  id: string;
  eventId: string;
  section: string;
  seat: string;
  qr: string; // encoded seed
  status: "valid" | "used";
  purchasedAt: number;
};

export type MissingReport = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  lastSeenZone: string;
  lastSeenAt: string;
  wearing: string;
  contact: string;
  photo?: string;
  status: "searching" | "found";
  createdAt: number;
};

export type NotificationItem = {
  id: string;
  kind: "alert" | "info" | "success";
  title: string;
  body: string;
  time: string;
};

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    kind: "alert",
    title: "West Gate approaching capacity",
    body: "Divert new arrivals to East and North gates. Wait times over 8 min.",
    time: "2 min ago",
  },
  {
    id: "n2",
    kind: "info",
    title: "Weather advisory",
    body: "Light showers expected around 21:30. Covered zones prepared.",
    time: "18 min ago",
  },
  {
    id: "n3",
    kind: "success",
    title: "Medical response resolved",
    body: "Incident near Food Court cleared. All units back on standby.",
    time: "42 min ago",
  },
  {
    id: "n4",
    kind: "info",
    title: "New event published",
    body: "Sunburn Day 2 tickets are live. Early-bird seats selling fast.",
    time: "1 hr ago",
  },
];

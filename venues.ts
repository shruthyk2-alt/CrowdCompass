export type VenueId = "chinnaswamy" | "sunburn" | "iisc";

export type Venue = {
  id: VenueId;
  name: string;
  location: string;
  capacity: number;
  event: string;
  image: string;
  emergencyContacts: { label: string; number: string }[];
  nearestMedical: string;
  nearestExit: string;
};

export const VENUES: Venue[] = [
  {
    id: "chinnaswamy",
    name: "M. Chinnaswamy Stadium",
    location: "Bengaluru, KA",
    capacity: 40000,
    event: "RCB vs CSK — IPL Demo Match",
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=70",
    emergencyContacts: [
      { label: "Venue Security", number: "+91 80 2286 1000" },
      { label: "Medical Booth", number: "+91 80 2286 1105" },
      { label: "Fire & Rescue", number: "101" },
      { label: "Police", number: "100" },
    ],
    nearestMedical: "Medical Booth · Level 2, near Pavilion Stand",
    nearestExit: "Emergency Exit · East Gate corridor",
  },
  {
    id: "sunburn",
    name: "Sunburn Festival",
    location: "Vagator, Goa",
    capacity: 55000,
    event: "Sunburn Music Festival — Main Night",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=70",
    emergencyContacts: [
      { label: "Venue Security", number: "+91 832 555 1201" },
      { label: "Medical Booth", number: "+91 832 555 1188" },
      { label: "Fire & Rescue", number: "101" },
      { label: "Police", number: "100" },
    ],
    nearestMedical: "Medic Tent · Behind Main Stage FOH",
    nearestExit: "Emergency Exit · South Gate service road",
  },
  {
    id: "iisc",
    name: "IISc Bengaluru Tech Fest",
    location: "IISc Campus, Bengaluru",
    capacity: 10000,
    event: "Annual Tech Fest — Day 2",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=70",
    emergencyContacts: [
      { label: "Campus Security", number: "+91 80 2293 2001" },
      { label: "Health Centre", number: "+91 80 2293 2444" },
      { label: "Fire & Rescue", number: "101" },
      { label: "Police", number: "100" },
    ],
    nearestMedical: "IISc Health Centre · Main Building",
    nearestExit: "Emergency Exit · Gymkhana side gate",
  },
];

export function getVenue(id: VenueId | null | undefined): Venue | null {
  return VENUES.find((v) => v.id === id) ?? null;
}

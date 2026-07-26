import type { Venue, VenueId } from "./venues";

export type Risk = "safe" | "moderate" | "crowded" | "critical";

export type ZoneData = {
  name: string;
  current: number;
  max: number;
  occupancy: number;
  queue: number;
  trend: "up" | "down" | "flat";
  risk: Risk;
};

export type GateData = {
  name: string;
  open: boolean;
  queue: number;
  waitMin: number;
  entrySpeed: number; // people/min
  exitSpeed: number;
};

export type Weather = {
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  rainChance: number;
  uv: number;
  aqi: number;
  condition: "Clear" | "Cloudy" | "Rain" | "Humid";
};

export type VenueSpecific =
  | {
      kind: "cricket";
      score: string;
      overs: string;
      wickets: number;
      status: string;
    }
  | {
      kind: "festival";
      currentArtist: string;
      nextArtist: string;
      nextAt: string;
      schedule: { time: string; artist: string }[];
    }
  | {
      kind: "techfest";
      todaysEvents: string[];
      workshops: { time: string; title: string }[];
      seminarOccupancy: number;
      hackathonCrowd: number;
      regQueue: number;
      cafeteria: number;
    };

export type LiveVenueData = {
  visitors: number;
  capacity: number;
  occupancy: number;
  risk: Risk;
  zones: ZoneData[];
  gates: GateData[];
  weather: Weather;
  specific: VenueSpecific;
};

function riskFor(pct: number): Risk {
  if (pct < 45) return "safe";
  if (pct < 70) return "moderate";
  if (pct < 88) return "crowded";
  return "critical";
}

function jitter(base: number, spread: number, seed: number) {
  // deterministic-ish random walk based on seed + time bucket
  const t = Math.floor(Date.now() / 5000);
  const x = Math.sin(seed * 9301 + t * 49297) * 43758.5453;
  const r = x - Math.floor(x);
  return Math.max(0, Math.round(base + (r - 0.5) * 2 * spread));
}

const ZONE_NAMES = [
  "North Gate",
  "South Gate",
  "East Gate",
  "West Gate",
  "Main Stage",
  "Food Court",
  "Parking",
  "VIP Area",
];

function buildZones(capacity: number, occ: number, seed: number): ZoneData[] {
  const weights = [0.08, 0.08, 0.08, 0.08, 0.35, 0.15, 0.14, 0.04];
  return ZONE_NAMES.map((name, i) => {
    const max = Math.round(capacity * weights[i] * 1.15);
    const base = Math.round(capacity * weights[i] * (occ / 100));
    const current = Math.min(max, jitter(base, base * 0.12, seed + i));
    const pct = Math.round((current / max) * 100);
    const queue = jitter(pct > 60 ? pct * 1.2 : pct * 0.4, 15, seed + i + 7);
    const trendR = Math.sin(seed + i + Date.now() / 60000);
    return {
      name,
      current,
      max,
      occupancy: pct,
      queue,
      trend: trendR > 0.2 ? "up" : trendR < -0.2 ? "down" : "flat",
      risk: riskFor(pct),
    };
  });
}

function buildGates(seed: number, occ: number): GateData[] {
  return ["North Gate", "South Gate", "East Gate", "West Gate"].map((name, i) => {
    const q = jitter(occ * 0.8, 20, seed + i * 3);
    return {
      name,
      open: i !== 3 || occ < 90,
      queue: q,
      waitMin: Math.max(1, Math.round(q / 12)),
      entrySpeed: jitter(60, 15, seed + i + 11),
      exitSpeed: jitter(48, 12, seed + i + 17),
    };
  });
}

function buildWeather(venue: VenueId, seed: number): Weather {
  const base = venue === "sunburn" ? 30 : venue === "chinnaswamy" ? 28 : 26;
  const temp = jitter(base, 2, seed + 100);
  const humidity = jitter(venue === "sunburn" ? 78 : 60, 8, seed + 101);
  const rainChance = jitter(venue === "sunburn" ? 40 : 15, 20, seed + 102);
  return {
    temp,
    feels: temp + 2,
    humidity,
    wind: jitter(12, 6, seed + 103),
    rainChance,
    uv: jitter(6, 2, seed + 104),
    aqi: jitter(venue === "iisc" ? 60 : 85, 20, seed + 105),
    condition: rainChance > 55 ? "Rain" : humidity > 75 ? "Humid" : rainChance > 30 ? "Cloudy" : "Clear",
  };
}

function buildSpecific(venue: VenueId, seed: number): VenueSpecific {
  if (venue === "chinnaswamy") {
    const runs = jitter(178, 25, seed + 200);
    const wkts = Math.min(9, Math.floor(jitter(4, 2, seed + 201) / 1));
    const overs = `${Math.min(19, 12 + Math.floor(seed % 6))}.${Math.floor(Math.random() * 6)}`;
    return {
      kind: "cricket",
      score: `${runs}/${wkts}`,
      overs,
      wickets: wkts,
      status: "RCB batting · 2nd innings",
    };
  }
  if (venue === "sunburn") {
    return {
      kind: "festival",
      currentArtist: "Martin Garrix",
      nextArtist: "DJ Snake",
      nextAt: "23:30",
      schedule: [
        { time: "21:00", artist: "Nucleya" },
        { time: "22:15", artist: "Martin Garrix" },
        { time: "23:30", artist: "DJ Snake" },
        { time: "01:00", artist: "Alan Walker" },
      ],
    };
  }
  return {
    kind: "techfest",
    todaysEvents: ["Keynote: AI in India", "Robotics Demo", "Hackathon Finals", "Startup Pitches"],
    workshops: [
      { time: "10:00", title: "Intro to Quantum Computing" },
      { time: "12:00", title: "Building with LLMs" },
      { time: "15:00", title: "Robotics Lab Tour" },
    ],
    seminarOccupancy: jitter(72, 10, seed + 301),
    hackathonCrowd: jitter(340, 40, seed + 302),
    regQueue: jitter(28, 10, seed + 303),
    cafeteria: jitter(65, 15, seed + 304),
  };
}

export function buildLiveData(venue: Venue): LiveVenueData {
  const seed = venue.id.length * 13 + Math.floor(Date.now() / 15000);
  const occ = jitter(venue.id === "sunburn" ? 82 : venue.id === "chinnaswamy" ? 68 : 54, 6, seed);
  const clampedOcc = Math.min(98, Math.max(20, occ));
  const visitors = Math.round((venue.capacity * clampedOcc) / 100);
  return {
    visitors,
    capacity: venue.capacity,
    occupancy: clampedOcc,
    risk: riskFor(clampedOcc),
    zones: buildZones(venue.capacity, clampedOcc, seed),
    gates: buildGates(seed, clampedOcc),
    weather: buildWeather(venue.id, seed),
    specific: buildSpecific(venue.id, seed),
  };
}

export const RISK_LABEL: Record<Risk, string> = {
  safe: "Safe",
  moderate: "Moderate",
  crowded: "Crowded",
  critical: "Critical",
};

export const RISK_COLOR: Record<Risk, string> = {
  safe: "text-safe",
  moderate: "text-moderate",
  crowded: "text-crowded",
  critical: "text-critical",
};

export const RISK_BG: Record<Risk, string> = {
  safe: "bg-safe/15 text-safe border-safe/30",
  moderate: "bg-moderate/15 text-moderate border-moderate/30",
  crowded: "bg-crowded/15 text-crowded border-crowded/30",
  critical: "bg-critical/15 text-critical border-critical/30",
};

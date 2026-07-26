import { useEffect, useState } from "react";
import { buildLiveData, type LiveVenueData } from "@/lib/simulate";
import type { Venue } from "@/lib/venues";

export function useSimulatedVenueData(venue: Venue | null): LiveVenueData | null {
  const [data, setData] = useState<LiveVenueData | null>(venue ? buildLiveData(venue) : null);
  useEffect(() => {
    if (!venue) {
      setData(null);
      return;
    }
    setData(buildLiveData(venue));
    const t = setInterval(() => setData(buildLiveData(venue)), 5000);
    return () => clearInterval(t);
  }, [venue]);
  return data;
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getVenue, type VenueId, type Venue } from "@/lib/venues";

const KEY = "cc_active_venue";

type Ctx = {
  venue: Venue | null;
  setVenue: (id: VenueId) => void;
  clear: () => void;
};

const VenueCtx = createContext<Ctx | null>(null);

export function ActiveVenueProvider({ children }: { children: ReactNode }) {
  const [venue, setVenueState] = useState<Venue | null>(null);

  useEffect(() => {
    const id = (typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null) as VenueId | null;
    setVenueState(getVenue(id));
  }, []);

  const setVenue = useCallback((id: VenueId) => {
    localStorage.setItem(KEY, id);
    setVenueState(getVenue(id));
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setVenueState(null);
  }, []);

  return <VenueCtx.Provider value={{ venue, setVenue, clear }}>{children}</VenueCtx.Provider>;
}

export function useActiveVenue() {
  const c = useContext(VenueCtx);
  if (!c) throw new Error("useActiveVenue must be used within ActiveVenueProvider");
  return c;
}

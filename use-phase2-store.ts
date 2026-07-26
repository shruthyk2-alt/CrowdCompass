import { useCallback, useEffect, useState } from "react";
import type { EventItem, MissingReport, Ticket } from "@/lib/phase2-data";

const TICKETS_KEY = "cc_tickets";
const MISSING_KEY = "cc_missing";

function read<T>(k: string): T[] {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(k: string, v: T[]) {
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new Event("cc-storage"));
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    setTickets(read<Ticket>(TICKETS_KEY));
    const on = () => setTickets(read<Ticket>(TICKETS_KEY));
    window.addEventListener("cc-storage", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("cc-storage", on);
      window.removeEventListener("storage", on);
    };
  }, []);

  const book = useCallback((event: EventItem, qty: number) => {
    const existing = read<Ticket>(TICKETS_KEY);
    const created: Ticket[] = Array.from({ length: qty }).map((_, i) => {
      const section = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
      const row = Math.floor(Math.random() * 30) + 1;
      const num = Math.floor(Math.random() * 40) + 1;
      const id = `TCK-${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2, 6)}`;
      return {
        id,
        eventId: event.id,
        section,
        seat: `${section}${row}-${num}`,
        qr: id,
        status: "valid",
        purchasedAt: Date.now(),
      };
    });
    write(TICKETS_KEY, [...existing, ...created]);
    return created;
  }, []);

  const markUsed = useCallback((id: string) => {
    const all = read<Ticket>(TICKETS_KEY);
    write(
      TICKETS_KEY,
      all.map((t) => (t.id === id ? { ...t, status: "used" as const } : t)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    const all = read<Ticket>(TICKETS_KEY);
    write(
      TICKETS_KEY,
      all.filter((t) => t.id !== id),
    );
  }, []);

  return { tickets, book, markUsed, remove };
}

export function useMissing() {
  const [reports, setReports] = useState<MissingReport[]>([]);
  useEffect(() => {
    setReports(read<MissingReport>(MISSING_KEY));
    const on = () => setReports(read<MissingReport>(MISSING_KEY));
    window.addEventListener("cc-storage", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("cc-storage", on);
      window.removeEventListener("storage", on);
    };
  }, []);

  const submit = useCallback((r: Omit<MissingReport, "id" | "createdAt" | "status">) => {
    const all = read<MissingReport>(MISSING_KEY);
    const item: MissingReport = {
      ...r,
      id: `MP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      status: "searching",
    };
    write(MISSING_KEY, [item, ...all]);
    return item;
  }, []);

  const markFound = useCallback((id: string) => {
    const all = read<MissingReport>(MISSING_KEY);
    write(
      MISSING_KEY,
      all.map((r) => (r.id === id ? { ...r, status: "found" as const } : r)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    const all = read<MissingReport>(MISSING_KEY);
    write(
      MISSING_KEY,
      all.filter((r) => r.id !== id),
    );
  }, []);

  return { reports, submit, markFound, remove };
}

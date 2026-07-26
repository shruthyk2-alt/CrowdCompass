import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CCUser } from "@/lib/auth";
import { getCurrentUser, signIn as libSignIn, signOut as libSignOut, signUp as libSignUp, updateUser as libUpdateUser } from "@/lib/auth";

type AuthCtx = {
  user: CCUser | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (i: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
  signOut: () => void;
  updateUser: (p: Partial<Pick<CCUser, "fullName" | "email" | "phone">>) => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CCUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setHydrated(true);
    const onStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await libSignIn(email, password);
    setUser(u);
  }, []);

  const signUp = useCallback(
    async (i: { fullName: string; email: string; phone: string; password: string }) => {
      const u = await libSignUp(i);
      setUser(u);
    },
    [],
  );

  const signOut = useCallback(() => {
    libSignOut();
    setUser(null);
  }, []);

  const updateUser = useCallback((p: Partial<Pick<CCUser, "fullName" | "email" | "phone">>) => {
    libUpdateUser(p);
    setUser(getCurrentUser());
  }, []);

  return (
    <Ctx.Provider value={{ user, hydrated, signIn, signUp, signOut, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

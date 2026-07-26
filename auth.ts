// Client-side auth using localStorage. SHA-256 password hashing.
export type CCUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: number;
};

export type CCSession = { userId: string; createdAt: number };

const USERS_KEY = "cc_users";
const SESSION_KEY = "cc_session";

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): CCUser[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: CCUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): CCSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): CCUser | null {
  const s = getSession();
  if (!s) return null;
  return readUsers().find((u) => u.id === s.userId) ?? null;
}

export async function signUp(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<CCUser> {
  const users = readUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }
  const user: CCUser = {
    id: crypto.randomUUID(),
    fullName: input.fullName.trim(),
    email,
    phone: input.phone.trim(),
    passwordHash: await sha256(input.password),
    createdAt: Date.now(),
  };
  users.push(user);
  writeUsers(users);
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ userId: user.id, createdAt: Date.now() } satisfies CCSession),
  );
  return user;
}

export async function signIn(email: string, password: string): Promise<CCUser> {
  const users = readUsers();
  const hash = await sha256(password);
  const user = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.passwordHash === hash,
  );
  if (!user) throw new Error("Incorrect email or password.");
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ userId: user.id, createdAt: Date.now() } satisfies CCSession),
  );
  return user;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("cc_active_venue");
}

export function updateUser(patch: Partial<Omit<CCUser, "id" | "passwordHash" | "createdAt">>) {
  const s = getSession();
  if (!s) return;
  const users = readUsers();
  const i = users.findIndex((u) => u.id === s.userId);
  if (i < 0) return;
  users[i] = { ...users[i], ...patch };
  writeUsers(users);
}

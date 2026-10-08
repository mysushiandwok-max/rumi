import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "rumi_admin_session";
const SESSION_DURATION = "12h";
const SESSION_SECONDS = 60 * 60 * 12;

// Frena la fuerza bruta: 5 fallos por IP bloquean 15 minutos. En memoria (se reinicia con la app).
// ponytail: contador por proceso; con varias instancias haría falta compartirlo (SQLite).
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const fails = new Map<string, { count: number; until: number }>();

// Hash de relleno: se compara siempre contra algo, así el tiempo de respuesta no revela si el correo existe.
let dummyHash: Promise<string> | undefined;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET falta o es demasiado corto (mínimo 32 caracteres)");
  return new TextEncoder().encode(secret);
}

export type AdminSession = { email: string };

async function signSessionToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
});

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  return session;
}

export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function signInAdmin(email: string, password: string): Promise<{ error: string } | { success: true }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminPasswordHash) {
    return { error: "Servicio no disponible." };
  }

  const ip = await clientIp();
  const entry = fails.get(ip);
  if (entry && entry.until > Date.now()) {
    return { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." };
  }

  // Siempre se ejecuta bcrypt.compare, aunque el correo no coincida.
  const emailOk = email.trim().toLowerCase() === adminEmail.toLowerCase();
  dummyHash ??= bcrypt.hash("relleno-sin-uso", 10);
  const valid = await bcrypt.compare(password, emailOk ? adminPasswordHash : await dummyHash);
  if (!emailOk || !valid) {
    const count = (entry && entry.until === 0 ? entry.count : 0) + 1;
    fails.set(ip, count >= MAX_FAILS ? { count: 0, until: Date.now() + LOCK_MS } : { count, until: 0 });
    console.warn("[auth] intento de login fallido", { ip, at: new Date().toISOString() });
    return { error: "Correo o contraseña incorrectos." };
  }
  fails.delete(ip);

  const token = await signSessionToken(adminEmail);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  return { success: true };
}

export async function signOutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

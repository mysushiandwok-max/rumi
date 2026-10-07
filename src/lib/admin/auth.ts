import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "rumi_admin_session";
const SESSION_DURATION = "7d";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET no está configurado en .env.local");
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
    const { payload } = await jwtVerify(token, getSecretKey());
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

export async function signInAdmin(email: string, password: string): Promise<{ error: string } | { success: true }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminPasswordHash) {
    return { error: "El administrador no está configurado. Revisa .env.local." };
  }

  if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const valid = await bcrypt.compare(password, adminPasswordHash);
  if (!valid) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const token = await signSessionToken(adminEmail);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function signOutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

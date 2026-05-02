import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const SESSION_COOKIE = "volutype_session";
const SESSION_DAYS = 30;

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);

  await prisma.userSession.create({
    data: {
      sessionToken: token,
      userId,
      expires,
    },
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const session = await prisma.userSession.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    if (session) {
      await deleteSession();
    }
    return null;
  }

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.userSession.deleteMany({
      where: { sessionToken: token },
    });
  }

  (await cookies()).delete(SESSION_COOKIE);
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}
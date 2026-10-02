import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    const { id, name, email, image } = session.user;
    return { id, name, email, image: image ?? null };
  } catch (error) {
    console.error("SESSION LOOKUP ERROR:", error);
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

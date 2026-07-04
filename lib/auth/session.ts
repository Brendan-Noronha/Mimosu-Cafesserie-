import { cookies } from "next/headers";
import { verifyToken, type SessionPayload } from "./magicLink";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("mimosu_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

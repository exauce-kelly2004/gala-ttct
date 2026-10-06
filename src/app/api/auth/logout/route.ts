import { destroySession } from "@/server/auth";

export async function POST() {
  await destroySession();
  return Response.json({ ok: true });
}

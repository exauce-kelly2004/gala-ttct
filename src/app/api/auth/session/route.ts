import { getSessionUser } from "@/server/auth";

export async function GET() {
  const user = await getSessionUser();
  return Response.json(user ? { email: user.email, role: user.role } : null, { headers: { "Cache-Control": "no-store" } });
}

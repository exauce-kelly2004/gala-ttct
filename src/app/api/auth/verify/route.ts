import { z } from "zod";
import { verifyLoginCode } from "@/server/auth";

const body = z.object({ email: z.string().trim().email().max(254), code: z.string().max(12) });

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_CODE" }, { status: 400 });

  const user = await verifyLoginCode(parsed.data.email, parsed.data.code);
  if (!user) return Response.json({ error: "INVALID_CODE" }, { status: 401 });
  return Response.json({ email: user.email, role: user.role });
}

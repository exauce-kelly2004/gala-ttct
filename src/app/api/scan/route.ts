import { z } from "zod";
import { requireRole } from "@/server/auth";
import { verifyTicket } from "@/server/checkin";

const body = z.object({ code: z.string().trim().min(1).max(100) });

/** Valide un billet à l'entrée (QR ou code saisi). ADMIN ou STAFF. */
export async function POST(request: Request) {
  const auth = await requireRole("ADMIN", "STAFF");
  if (auth instanceof Response) return auth;

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_INPUT" }, { status: 400 });

  return Response.json(await verifyTicket(parsed.data.code, auth.id), { headers: { "Cache-Control": "no-store" } });
}

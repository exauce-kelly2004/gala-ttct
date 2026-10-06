import { z } from "zod";
import { listPassCapacity, setPassCapacity } from "@/server/admin";
import { requireRole } from "@/server/auth";

/** Pass avec leur capacité et le nombre déjà réservé. ADMIN uniquement. */
export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;
  return Response.json(await listPassCapacity(), { headers: { "Cache-Control": "no-store" } });
}

const body = z.object({ slug: z.string().max(40), capacity: z.number().int().min(0).max(100_000).nullable() });

/** Fixe le nombre de pass en vente (null = illimité). ADMIN uniquement. */
export async function PATCH(request: Request) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_INPUT" }, { status: 400 });

  const result = await setPassCapacity(parsed.data.slug, parsed.data.capacity);
  if (result === "NOT_FOUND") return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  if (result === "BELOW_RESERVED") return Response.json({ error: "BELOW_RESERVED" }, { status: 409 });
  return Response.json(await listPassCapacity());
}

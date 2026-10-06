import { createOrder, OrderError } from "@/server/orders";

/** Crée une commande (public : l'acheteur n'a pas de compte). Le serveur revérifie tout ce que le front envoie. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  try {
    // Derrière le proxy de l'hébergeur, la vraie adresse est le premier élément de x-forwarded-for
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;
    return Response.json(await createOrder(body, ip));
  } catch (error) {
    if (error instanceof OrderError) {
      return Response.json({ error: error.code, message: error.message }, { status: error.code === "SOLD_OUT" ? 409 : error.code === "RATE_LIMITED" ? 429 : 400 });
    }
    console.error("[orders] création impossible", error);
    return Response.json({ error: "ORDER_FAILED" }, { status: 500 });
  }
}

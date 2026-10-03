import { db } from "@/lib/db";

// Vérifie que l'application et la base PostgreSQL répondent.
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("[health] connexion base impossible", error);
    return Response.json({ status: "error", database: "unreachable" }, { status: 503 });
  }
}

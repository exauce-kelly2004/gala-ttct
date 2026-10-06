/**
 * Remplit la base avec les 3 pass et, si ADMIN_EMAIL est fourni, crée le premier administrateur.
 * Usage : npm run db:seed            (pass seulement)
 *         ADMIN_EMAIL=moi@exemple.com npm run db:seed
 * Relançable sans risque : les pass sont mis à jour, l'admin n'est jamais dupliqué.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { passes } from "../src/config/passes";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  for (const p of passes) {
    const data = { name: p.name, price: p.price, seats: p.seats, maxPerOrder: p.maxPerOrder };
    await db.passType.upsert({ where: { slug: p.slug }, create: { slug: p.slug, ...data }, update: data });
  }
  console.log(`${passes.length} pass enregistrés.`);

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (email) {
    await db.user.upsert({ where: { email }, create: { email, role: "ADMIN" }, update: { role: "ADMIN", revokedAt: null } });
    console.log(`Administrateur : ${email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

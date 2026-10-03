import "server-only";
import { z } from "zod";

/**
 * Variables d'environnement côté serveur, validées au premier import.
 * Une variable manquante ou invalide fait échouer le démarrage avec un message clair.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.url(),
  DATABASE_URL: z.string().startsWith("postgres", "DATABASE_URL doit être une URL PostgreSQL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variables d'environnement invalides :", z.treeifyError(parsed.error));
  throw new Error("Configuration invalide — voir .env.example");
}

export const env = parsed.data;

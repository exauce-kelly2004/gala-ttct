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
  /** Clé qui protège les codes de connexion et les jetons de session (32 caractères minimum). */
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET doit faire au moins 32 caractères"),
  /** E-mails : sans clé Resend, les messages sont seulement écrits dans le terminal (développement). */
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("TTCT Gala <onboarding@resend.dev>"),
  /** Adresse qui reçoit les réponses des clients (l'expéditeur n'a pas de boîte de réception). Facultative. */
  EMAIL_REPLY_TO: z.string().optional(),
  /** « simulated » : la commande est marquée payée aussitôt (développement uniquement). */
  PAYMENT_PROVIDER: z.string().default("simulated"),
  /** Secret de la tâche programmée des rappels (l'hébergeur l'envoie dans l'en-tête Authorization). */
  CRON_SECRET: z.string().min(16).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variables d'environnement invalides :", z.treeifyError(parsed.error));
  throw new Error("Configuration invalide — voir .env.example");
}

export const env = parsed.data;

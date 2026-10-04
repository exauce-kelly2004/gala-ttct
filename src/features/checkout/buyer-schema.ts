import { z } from "zod";

/** Normalise un numéro : retire espaces, points et tirets. */
export const normalizePhone = (value: string) => value.replace(/[\s.-]/g, "");

/**
 * Coordonnées de l'acheteur : le strict minimum du cahier des charges.
 * Téléphone : format béninois à 10 chiffres (01 XX XX XX XX), avec ou sans +229, ou numéro international.
 * Ce schéma sera réutilisé côté serveur à l'étape back-end.
 */
export const buyerSchema = z.object({
  lastName: z.string().trim().min(2, "Saisissez votre nom."),
  firstName: z.string().trim().min(2, "Saisissez votre prénom."),
  email: z.email("Saisissez une adresse e-mail valide, vos billets y seront envoyés."),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => /^(\+229)?01\d{8}$/.test(v) || /^\+\d{8,15}$/.test(v), "Saisissez un numéro valide, par exemple 01 97 86 57 58."),
  accept: z.literal(true, { error: "Acceptez les conditions de vente pour continuer." }),
});

export type BuyerInput = z.input<typeof buyerSchema>;
export type BuyerErrors = Partial<Record<keyof BuyerInput, string>>;

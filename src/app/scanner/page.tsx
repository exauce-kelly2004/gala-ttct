import { redirect } from "next/navigation";

/** L'ancienne adresse du scanner : il vit désormais dans l'espace réservé. */
export default function ScannerPage() {
  redirect("/espace/controle");
}

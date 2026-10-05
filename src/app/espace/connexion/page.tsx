import { Suspense } from "react";
import { LoginForm } from "@/features/auth/LoginForm";

export default function ConnexionPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

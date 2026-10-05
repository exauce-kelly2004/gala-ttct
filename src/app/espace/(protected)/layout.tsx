import { StaffShell } from "@/features/auth/StaffShell";

export default function ProtectedLayout({ children }: LayoutProps<"/espace">) {
  return <StaffShell>{children}</StaffShell>;
}

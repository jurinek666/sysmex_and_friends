import { requireAuth } from "@/lib/admin/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Zajistí autentizaci pro všechny admin stránky
  await requireAuth();

  return <>{children}</>;
}
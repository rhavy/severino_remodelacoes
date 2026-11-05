import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Toaster } from "sonner";
import AdminNavigation from "./_components/AdminNavigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Proteção de sessão no lado do servidor com Better-Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se o utilizador não estiver autenticado, redireciona imediatamente para o login
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 lg:flex">
      <AdminNavigation userName={session.user.name || session.user.email} />

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <main>{children}</main>
      </div>

      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}

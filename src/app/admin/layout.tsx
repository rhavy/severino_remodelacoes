import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderGit2,
  FileSpreadsheet,
  LogOut,
  Building2,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { Toaster } from "sonner";

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
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar Administrativo */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/80 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white block leading-none">SEVERINO</span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Painel Admin</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 block uppercase tracking-wider font-semibold">Sessão Ativa</span>
            <p className="text-xs font-bold text-white truncate mt-0.5">{session.user.name || session.user.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Administrador
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              <span>Visão Geral & Leads</span>
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700"
            >
              <FolderGit2 className="w-4 h-4 text-amber-500" />
              <span>Gestão de Projetos</span>
            </Link>
          </nav>
        </div>

        {/* Bottom links */}
        <div className="space-y-3 pt-6 border-t border-zinc-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <span>Ver Site Público</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
          </Link>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 overflow-x-auto min-w-0">
        {children}
      </main>

      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}

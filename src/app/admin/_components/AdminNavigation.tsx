"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  FolderGit2,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

type AdminNavigationProps = {
  userName: string;
};

const links = [
  {
    href: "/admin/dashboard",
    label: "Visão Geral & Leads",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/projects",
    label: "Gestão de Projetos",
    icon: FolderGit2,
  },
];

export default function AdminNavigation({ userName }: AdminNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-zinc-950">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-black leading-none text-white">SEVERINO</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Painel Admin</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
          aria-controls="admin-navigation"
          className="rounded-lg p-2 text-zinc-200 transition hover:bg-zinc-800"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="admin-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col justify-between gap-5 border-r border-zinc-800 bg-zinc-900 p-4 shadow-xl transition-transform duration-300 sm:p-5 ${
          isOpen ? "translate-x-0" : ""
        } lg:static lg:min-h-screen lg:w-64 lg:shrink-0 lg:translate-x-0 lg:gap-8 lg:p-6 lg:shadow-none`}
      >
        <div className="space-y-5 lg:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-zinc-950 shadow-lg shadow-amber-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-base font-black leading-none text-white">SEVERINO</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Painel Admin</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fechar menu"
              className="rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-800 lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Sessão Ativa</span>
            <p className="mt-0.5 truncate text-xs font-bold text-white">{userName}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Administrador
            </span>
          </div>

          <nav className="space-y-1.5">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "border-amber-500/30 bg-amber-500/10 text-white"
                      : "border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-amber-500" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-800 pt-4 lg:pt-6">
          <Link
            href="/"
            target="_blank"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <span>Ver Site Público</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-amber-500" />
          </Link>
        </div>
      </aside>
    </>
  );
}

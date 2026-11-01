"use client";

import Link from "next/link";
import { Building2, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { messages } = useLanguage();
  const links = [
    { href: "#sobre", label: messages.header.about },
    { href: "#servicos", label: messages.header.services },
    { href: "#galeria", label: messages.header.gallery },
    { href: "#faq", label: messages.header.faq },
    { href: "#contato", label: messages.header.contact },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 text-white shadow-xl backdrop-blur-md">
      <div className="container mx-auto px-6">
        <nav className="flex h-20 items-center justify-between gap-6" aria-label={messages.header.navigation}>
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 font-black text-zinc-950 shadow-lg shadow-amber-500/20 transition-colors group-hover:bg-amber-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xl font-black leading-none tracking-tight text-white">
                SEVERINO
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                REMODELAÇÕES
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-zinc-300 lg:flex">
            {links.map(({ href, label }) => (
              <a key={href} href={href} className="transition-colors hover:text-amber-400">
                {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <LanguageSwitcher />
            <a
              href="#orcamento"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400"
            >
              {messages.header.quote}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-none lg:hidden"
            aria-label={isMobileMenuOpen ? messages.header.closeMenu : messages.header.menu}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="space-y-4 border-b border-zinc-800 bg-zinc-950 px-6 py-6 lg:hidden">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-medium text-zinc-200 hover:text-amber-400"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4">
            <LanguageSwitcher fullWidth />
            <a
              href="#orcamento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl bg-amber-500 py-3 text-center text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-amber-400"
            >
              {messages.header.quoteFree}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

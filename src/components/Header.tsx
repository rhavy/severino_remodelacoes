"use client";

import Link from "next/link";
import { Building2, PhoneCall, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351 912 345 678";
  const cleanPhone = companyPhone.replace(/[^0-9+]/g, "");

  return (
    <header className="w-full fixed top-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-white shadow-xl z-50">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between gap-6 h-20" role="navigation">
          {/* Logo & Marca */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                SEVERINO
              </span>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                REMODELAÇÕES
              </span>
            </div>
          </Link>

          {/* Links Desktop */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-zinc-300">
            <a href="#sobre" className="hover:text-amber-400 transition-colors">
              Sobre Nós
            </a>
            <a href="#servicos" className="hover:text-amber-400 transition-colors">
              Serviços
            </a>
            <a href="#galeria" className="hover:text-amber-400 transition-colors">
              Galeria
            </a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">
              Perguntas Frequentes
            </a>
            <a href="#contato" className="hover:text-amber-400 transition-colors">
              Contacto
            </a>
          </div>

          {/* Contacto / CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${cleanPhone}`}
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
              <span>{companyPhone}</span>
            </a>
            <a
              href="#orcamento"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Pedir Orçamento
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Dropdown Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-6 space-y-4">
          <a
            href="#sobre"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-zinc-200 hover:text-amber-400 font-medium"
          >
            Sobre Nós
          </a>
          <a
            href="#servicos"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-zinc-200 hover:text-amber-400 font-medium"
          >
            Serviços
          </a>
          <a
            href="#galeria"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-zinc-200 hover:text-amber-400 font-medium"
          >
            Galeria de Obras
          </a>
          <a
            href="#faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-zinc-200 hover:text-amber-400 font-medium"
          >
            Perguntas Frequentes
          </a>
          <a
            href="#contato"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-zinc-200 hover:text-amber-400 font-medium"
          >
            Contacto & Orçamento
          </a>
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
            <a
              href="#orcamento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-all"
            >
              Pedir Orçamento Gratuito
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
export default Header;

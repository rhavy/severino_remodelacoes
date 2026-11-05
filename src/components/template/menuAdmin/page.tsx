"use client";

import { SigIn } from '@/app/signup/_components/sigIn';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

type MenuLink = {
  link: string;
  titulo: string;
  icon?: ReactNode;
};

type MenuProps = {
  menuLinks: MenuLink[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function MenuAdmin({ menuLinks, isOpen, setIsOpen }: MenuProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-slate-900 lg:hidden">
        <Image src="/image/logo.png" alt="Severino Remodelações" width={120} height={40} className="object-contain" />
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isMobileOpen}
          aria-controls="dashboard-navigation"
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        id="dashboard-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col bg-white shadow-xl transition-transform duration-300 dark:bg-slate-900 ${
          isMobileOpen ? "translate-x-0" : ""
        } ${isOpen ? "lg:w-64" : "lg:w-16"} lg:translate-x-0 lg:shadow-md lg:transition-[width]`}
      >
      <div className="flex h-full flex-col">
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isOpen ? "" : "lg:hidden"}`}>
            <Image src={"/image/logo.png"} alt="Logo" width={120} height={40} className="object-contain" />
          </div>
          <button
            type="button"
            aria-label="Fechar menu"
            className="rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          <button
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            className="hidden rounded p-1 transition hover:bg-gray-200 dark:hover:bg-gray-800 lg:block"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}

          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-3 lg:p-4">
          {menuLinks.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 rounded p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {item.icon}
              <span className={isOpen ? "" : "lg:hidden"}>{item.titulo}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-3 dark:border-gray-700 lg:p-4">
          <SigIn isOpen={isOpen}/>
        </div>
      </div>
      </aside>
    </>
  );
}

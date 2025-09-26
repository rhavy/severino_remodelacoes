"use client";

import { SigIn } from '@/app/signup/_components/sigIn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

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
  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-white dark:bg-slate-900 h-screen shadow-md fixed transition-all duration-300`}
    >
      <div className="flex flex-col h-full">
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isOpen && 
          <div className='flex items-center'>
            <Image src={"/image/logo.png"} alt="Logo" width={120} height={40} className="object-contain" />
          </div>
          }
          <button
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
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
        <nav className="flex-1 p-4 space-y-2">
          {menuLinks.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {item.icon}
              {isOpen && <span>{item.titulo}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <SigIn isOpen={isOpen}/>
        </div>
      </div>
    </aside>
  );
}

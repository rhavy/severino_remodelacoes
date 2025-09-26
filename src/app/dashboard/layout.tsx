"use client";

import { useState } from "react";
import MenuAdmin from "@/components/template/menuAdmin/page";
import { LayoutDashboard, Image, MessageSquare } from "lucide-react";

const menuLinks = [
  { link: "/dashboard", titulo: "Dashboard", icon: <LayoutDashboard className="w-5 h-5 text-yellow-500" /> },
  { link: "/dashboard/gallery", titulo: "Gallery", icon: <Image className="w-5 h-5 text-yellow-500" /> },
  { link: "/dashboard/mensagensRecebidas", titulo: "Mensagens", icon: <MessageSquare className="w-5 h-5 text-yellow-500" /> }

];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <MenuAdmin menuLinks={menuLinks} isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Conteúdo principal */}
      <main className={`${isOpen ? "ml-64" : "ml-16"} flex-1 transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}

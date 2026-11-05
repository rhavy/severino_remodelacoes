"use client";

import { useState } from "react";
import MenuAdmin from "@/components/template/menuAdmin/page";
import { LayoutDashboard, Image, MessageSquare } from "lucide-react";
import { LanguageProvider } from "@/components/LanguageProvider";

const menuLinks = [
  { link: "/dashboard", titulo: "Dashboard", icon: <LayoutDashboard className="w-5 h-5 text-yellow-500" /> },
  { link: "/admin/leads", titulo: "Orçamentos (Leads)", icon: <MessageSquare className="w-5 h-5 text-yellow-500" /> },
  { link: "/dashboard/gallery", titulo: "Gallery", icon: <Image className="w-5 h-5 text-yellow-500" /> },
  { link: "/dashboard/mensagensRecebidas", titulo: "Mensagens Legadas", icon: <MessageSquare className="w-5 h-5 text-zinc-500" /> }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <LanguageProvider showPreferencePrompt={false}>
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-900 md:flex-row">
        {/* Sidebar */}
        <MenuAdmin menuLinks={menuLinks} isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Conteúdo principal */}
        <main className={`${isOpen ? "lg:ml-64" : "lg:ml-16"} min-w-0 flex-1 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}

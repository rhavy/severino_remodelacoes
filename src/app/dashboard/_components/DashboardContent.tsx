"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Hammer, Calendar } from "lucide-react";
import { Footer } from "@/components/template/footer/page";

export default function DashboardContent({ username }: { username: string }) {
  const [stats] = useState([
    { title: "Projetos Ativos", value: 12, icon: <Hammer className="w-6 h-6 text-yellow-500" /> },
    { title: "Clientes", value: 34, icon: <Users className="w-6 h-6 text-yellow-500" /> },
    { title: "Receita Mensal", value: "R$ 45.000", icon: <DollarSign className="w-6 h-6 text-yellow-500" /> },
    { title: "Próximos Eventos", value: 5, icon: <Calendar className="w-6 h-6 text-yellow-500" /> },
  ]);

  const [activities] = useState([
    { user: "João Silva", action: "Solicitou orçamento", time: "2h atrás" },
    { user: "Maria Souza", action: "Concluiu reforma", time: "1 dia atrás" },
    { user: "Carlos Lima", action: "Agendou visita técnica", time: "3 dias atrás" },
  ]);

  return (
    <div className="container mx-auto px-6 py-8 space-y-12">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="p-3 bg-yellow-100 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráfico simulado */}
      <motion.section
        className="bg-white dark:bg-slate-900 rounded-xl shadow p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-yellow-600 mb-4">Resumo Financeiro</h2>
        <div className="h-48 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-gray-400">
          [Gráfico Placeholder]
        </div>
      </motion.section>

      {/* Atividades recentes */}
      <motion.section
        className="bg-white dark:bg-slate-900 rounded-xl shadow p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-yellow-600 mb-4">Atividades Recentes</h2>
        <ul className="space-y-3">
          {activities.map((act, i) => (
            <li key={i} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{act.user}</p>
                <p className="text-gray-500 text-sm">{act.action}</p>
              </div>
              <span className="text-gray-400 text-sm">{act.time}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ImageIcon,
  EyeOff,
  FileText,
} from "lucide-react";
import { Footer } from "@/components/template/footer/page";
import { GoalChart } from "./GoalChart";

interface Stats {
  totalMensagens: number;
  mensagensNaoLidas: number;
  mensagensApagadas: number;
  mensagensLidas: number;
  mensagensResolvidas: number;
  mensagensPendentes: number;
  totalImagens: number;
  imagensOcultas: number;
}

interface Atividade {
  id: string;
  acao: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function DashboardContent({ username }: { username: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Falha ao buscar dados");
        }
        const data = await response.json();
        setStats(data.stats);
        setActivities(data.atividades);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = stats
    ? [
        {
          title: "Total de Mensagens",
          value: stats.totalMensagens,
          icon: <MessageSquare className="w-6 h-6 text-yellow-500" />,
        },
        {
          title: "Mensagens não lidas",
          value: stats.mensagensNaoLidas,
          icon: <FileText className="w-6 h-6 text-yellow-500" />,
        },
        {
          title: "Mensagens Apagadas",
          value: stats.mensagensApagadas,
          icon: <EyeOff className="w-6 h-6 text-yellow-500" />,
        },
        {
          title: "Total de Imagens",
          value: stats.totalImagens,
          icon: <ImageIcon className="w-6 h-6 text-yellow-500" />,
        },
      ]
    : [];

  const pendenteRate = stats ? (stats.mensagensPendentes / stats.totalMensagens) * 100 : 0;
  const apagadoRate = stats ? (stats.mensagensApagadas / stats.totalMensagens) * 100 : 0;
  const lidoRate = stats ? (stats.mensagensLidas / stats.totalMensagens) * 100 : 0;
  const resolvidoRate = stats ? (stats.mensagensResolvidas / stats.totalMensagens) * 100 : 0;


  const pendenteChartData = [
    {
      name: "Pendentes",
      value: pendenteRate,
      fill: "#fb923c",
    },
  ];

  const apagadoChartData = [
    {
      name: "Apagadas",
      value: apagadoRate,
      fill: "#f87171",
    },
  ];

  const lidoChartData = [
    {
      name: "Lidas",
      value: lidoRate,
      fill: "#3b82f6",
    },
  ];

  const resolvidoChartData = [
    {
      name: "Resolvidas",
      value: resolvidoRate,
      fill: "#22c55e",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8 space-y-12">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 animate-pulse"
              >
                <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            ))
          : statCards.map((stat, i) => (
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Gráficos de Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.section
          className="bg-white dark:bg-slate-900 rounded-xl shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-blue-500 mb-4">
            Taxa de Lidas
          </h2>
          {loading ? (
            <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-gray-400 animate-pulse">
              Carregando gráfico...
            </div>
          ) : (
            <GoalChart data={lidoChartData} label="Lidas" />
          )}
        </motion.section>

        <motion.section
          className="bg-white dark:bg-slate-900 rounded-xl shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-green-500 mb-4">
            Taxa de Resolvidas
          </h2>
          {loading ? (
            <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-gray-400 animate-pulse">
              Carregando gráfico...
            </div>
          ) : (
            <GoalChart data={resolvidoChartData} label="Resolvidas" />
          )}
        </motion.section>
        <motion.section
          className="bg-white dark:bg-slate-900 rounded-xl shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-orange-500 mb-4">
            Taxa de Pendentes
          </h2>
          {loading ? (
            <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-gray-400 animate-pulse">
              Carregando gráfico...
            </div>
          ) : (
            <GoalChart data={pendenteChartData} label="Pendentes" />
          )}
        </motion.section>

        <motion.section
          className="bg-white dark:bg-slate-900 rounded-xl shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-red-500 mb-4">
            Taxa de Apagadas
          </h2>
          {loading ? (
            <div className="h-80 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center text-gray-400 animate-pulse">
              Carregando gráfico...
            </div>
          ) : (
            <GoalChart data={apagadoChartData} label="Apagadas" />
          )}
        </motion.section>
      </div>

      {/* Atividades recentes */}
      <motion.section
        className="bg-white dark:bg-slate-900 rounded-xl shadow p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-yellow-600 mb-4">
          Atividades Recentes
        </h2>
        <ul className="space-y-3">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-lg animate-pulse"
                >
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                </li>
              ))
            : activities.map((act) => (
                <li
                  key={act.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {act.user.name} {act.acao}
                    </p>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {new Date(act.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
        </ul>
      </motion.section>

      <Footer />
    </div>
  );
}
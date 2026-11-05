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

  const getRate = (count: number) =>
    stats && stats.totalMensagens > 0
      ? (count / stats.totalMensagens) * 100
      : 0;
  const pendenteRate = getRate(stats?.mensagensPendentes ?? 0);
  const apagadoRate = getRate(stats?.mensagensApagadas ?? 0);
  const lidoRate = getRate(stats?.mensagensLidas ?? 0);
  const resolvidoRate = getRate(stats?.mensagensResolvidas ?? 0);


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
    <div className="mx-auto w-full max-w-[1920px] space-y-8 px-3 py-5 sm:space-y-10 sm:px-5 sm:py-7 2xl:space-y-12 2xl:px-10 2xl:py-10">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5 2xl:gap-6">
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
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:gap-4 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="p-3 bg-yellow-100 rounded-full">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-400 sm:text-base">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Gráficos de Meta */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4 sm:gap-5 2xl:gap-6">
        <motion.section
          className="min-w-0 rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-3 text-lg font-bold text-blue-500 sm:mb-4 sm:text-xl">
            Taxa de Lidas
          </h2>
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-center text-sm text-gray-400 animate-pulse dark:bg-slate-800 sm:h-80">
              Carregando gráfico...
            </div>
          ) : (
            <div className="h-64 sm:h-80"><GoalChart data={lidoChartData} label="Lidas" /></div>
          )}
        </motion.section>

        <motion.section
          className="min-w-0 rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="mb-3 text-lg font-bold text-green-500 sm:mb-4 sm:text-xl">
            Taxa de Resolvidas
          </h2>
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-center text-sm text-gray-400 animate-pulse dark:bg-slate-800 sm:h-80">
              Carregando gráfico...
            </div>
          ) : (
            <div className="h-64 sm:h-80"><GoalChart data={resolvidoChartData} label="Resolvidas" /></div>
          )}
        </motion.section>
        <motion.section
          className="min-w-0 rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-3 text-lg font-bold text-orange-500 sm:mb-4 sm:text-xl">
            Taxa de Pendentes
          </h2>
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-center text-sm text-gray-400 animate-pulse dark:bg-slate-800 sm:h-80">
              Carregando gráfico...
            </div>
          ) : (
            <div className="h-64 sm:h-80"><GoalChart data={pendenteChartData} label="Pendentes" /></div>
          )}
        </motion.section>

        <motion.section
          className="min-w-0 rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="mb-3 text-lg font-bold text-red-500 sm:mb-4 sm:text-xl">
            Taxa de Apagadas
          </h2>
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-center text-sm text-gray-400 animate-pulse dark:bg-slate-800 sm:h-80">
              Carregando gráfico...
            </div>
          ) : (
            <div className="h-64 sm:h-80"><GoalChart data={apagadoChartData} label="Apagadas" /></div>
          )}
        </motion.section>
      </div>

      {/* Atividades recentes */}
      <motion.section
        className="rounded-xl bg-white p-4 shadow dark:bg-slate-900 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="mb-4 text-lg font-bold text-yellow-600 sm:text-xl">
          Atividades Recentes
        </h2>
        <ul className="space-y-3">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 animate-pulse dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                </li>
              ))
            : activities.map((act) => (
                <li
                  key={act.id}
                  className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {act.user.name} {act.acao}
                    </p>
                  </div>
                  <span className="text-left text-sm text-gray-400 sm:shrink-0 sm:text-right">
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
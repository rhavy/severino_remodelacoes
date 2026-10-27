"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Hammer,
  ShieldCheck,
  CheckCircle,
  PhoneCall,
  ArrowRight,
  HardHat,
  Award,
  Sparkles,
} from "lucide-react";

export function Hero() {
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351 912 345 678";
  const cleanPhone = companyPhone.replace(/[^0-9+]/g, "");

  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-28 pb-20 lg:pt-36 lg:pb-28 border-b border-zinc-800">
      {/* Background glow effects - Paleta Amarelo Ocre / Mostarda Industrial com Carvão */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg shadow-amber-500/5 mb-6"
          >
            <HardHat className="w-4 h-4 text-amber-500" />
            <span>Severino Remodelações &bull; Especialistas em Construção Civil & Reformas</span>
          </motion.div>

          {/* Frase do Título de Impacto (Hero) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]"
          >
            Especialistas em{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600">
              Reformas e Construções em Geral
            </span>{" "}
            com Rigor Técnico e Alta Durabilidade.
          </motion.h1>

          {/* Subtítulo institucional */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed"
          >
            Da fundação aos acabamentos finos de alta gama: transformamos espaços residenciais e comerciais em Portugal com cumprimento estrito de prazos, transparência de custos e materiais de primeira linha.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#orcamento"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-zinc-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer"
            >
              Pedir Orçamento Gratuito
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/40 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <PhoneCall className="w-4 h-4 text-amber-500" />
              Ligar Agora: {companyPhone}
            </a>
          </motion.div>

          {/* Destaques / Selos de Confiança Industrial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-zinc-800/80 pt-8"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Garantia Técnica</h4>
                <p className="text-xs text-zinc-400">Obras certificadas e seguras</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Prazo Rigoroso</h4>
                <p className="text-xs text-zinc-400">Planeamento sem atrasos</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Materiais Nobres</h4>
                <p className="text-xs text-zinc-400">Qualidade de longa duração</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Chave na Mão</h4>
                <p className="text-xs text-zinc-400">Gestão do início ao fim</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

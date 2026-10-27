"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Users, Trophy } from "lucide-react";

export function AboutSection() {
  return (
    <section id="sobre" className="py-24 px-6 bg-zinc-950 border-b border-zinc-800 relative overflow-hidden">
      {/* Luz ambiente sutil decorativa */}
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Institucional */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Trophy className="w-3.5 h-3.5" />
              Severino Remodelações &bull; Tradição e Confiança
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Transformamos Projetos em Realidade com Máxima Exigência Construtiva
            </h2>
            <p className="mt-5 text-zinc-300 leading-relaxed text-sm sm:text-base">
              Fundada com a premissa de superar a informalidade no setor da construção civil, a <strong className="text-amber-400">Severino Remodelações</strong> consolidou-se como referência no mercado português de obras residenciais e remodelações corporativas.
            </p>
            <p className="mt-3 text-zinc-400 leading-relaxed text-sm">
              Combinamos planeamento de engenharia rigoroso, materiais com certificação europeia e uma equipa própria de operários especializados em alvenaria, carpintaria, eletricidade, canalização e acabamentos de requinte.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.03, borderColor: "rgba(245, 158, 11, 0.4)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors shadow-lg"
              >
                <span className="text-2xl font-black text-amber-400 block">+10 Anos</span>
                <span className="text-xs text-zinc-400 mt-1 block">De experiência no mercado de construção</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, borderColor: "rgba(245, 158, 11, 0.4)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors shadow-lg"
              >
                <span className="text-2xl font-black text-amber-400 block">100%</span>
                <span className="text-xs text-zinc-400 mt-1 block">Compromisso com prazos estipulados</span>
              </motion.div>
            </div>

            <div className="mt-8 space-y-3">
              {[
                "Alvará de construção e seguros de responsabilidade civil ativos",
                "Acompanhamento direto e diário de encarregado geral em todas as obras",
                "Orçamentos discriminados sem surpresas ou cobranças imprevistas",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 * i + 0.3 }}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Imagem Institucional */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            >
              <Image
                src="/image/quem-somos.jpeg"
                alt="Equipa de engenharia e obras da Severino Remodelações"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            </motion.div>

            {/* Card flutuante com destaque animado */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              whileHover={{ y: -4, borderColor: "rgba(245, 158, 11, 0.6)" }}
              className="absolute -bottom-6 -left-4 sm:left-6 p-4 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-amber-500/30 shadow-2xl max-w-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Garantia Estrutural</h4>
                  <p className="text-[11px] text-zinc-400">Total assistência pós-conclusão da obra</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default AboutSection;

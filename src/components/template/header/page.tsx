"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Header() {
  return (
    <section className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-20">
      <div className="container mx-auto grid md:grid-cols-2 items-center gap-12">
        
        {/* Texto animado */}
        <motion.div
          className="text-center md:text-left max-w-2xl mx-auto md:mx-0"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-2xl font-bold text-white md:text-2xl lg:text-4xl ">
            Construindo sonhos, <br /> reformando realidades.
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            A <strong className="text-yellow-400">Severino Remodelações</strong> é especialista em reformas,
            construções e manutenção predial. Qualidade, confiança e
            comprometimento em cada projeto.
          </p>
          <div className="mt-8 flex justify-center md:justify-start gap-4">
            <Link
              href="/contato"
              className="rounded-lg bg-yellow-500 px-6 py-3 text-slate-900 font-medium hover:bg-yellow-400 transition shadow-lg"
            >
              Solicitar Orçamento
            </Link>
            <Link
              href="/projetos"
              className="rounded-lg border border-white px-6 py-3 text-white font-medium hover:bg-white hover:text-slate-900 transition"
            >
              Ver Projetos
            </Link>
          </div>
        </motion.div>

        {/* Imagem animada */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Image
            src="/image/obra.jpeg"
            alt="Equipe de construção civil"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl border border-gray-700 animate-fade-in-up"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}

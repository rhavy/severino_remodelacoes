"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "O pedido de orçamento e a visita técnica inicial têm custos?",
    answer: "Não. A visita técnica para levantamento das necessidades do projeto e o envio da proposta detalhada com estimativa de prazos e valores são 100% gratuitos e sem qualquer compromisso para toda a região de Lisboa e arredores.",
  },
  {
    question: "Como é garantido o cumprimento do prazo estipulado para a obra?",
    answer: "Antes do início da obra, entregamos ao cliente um cronograma executivo detalhado semana a semana. Trabalhamos sob contrato com cláusulas contratuais de garantia de entrega no prazo acordado.",
  },
  {
    question: "A Severino Remodelações trata das licenças e alvarás necessários?",
    answer: "Sim. Acompanhamos e prestamos todo o apoio técnico para projetos camarários, pedidos de licença de ocupação de via pública e comunicação prévia junto das Câmaras Municipais.",
  },
  {
    question: "Que garantias são fornecidas após a conclusão da obra?",
    answer: "Cumprimos rigorosamente a legislação portuguesa em vigor, fornecendo garantias estruturais e garantia para intervenções de acabamentos e equipamentos instalados, com assistência pós-obra garantida.",
  },
  {
    question: "Vocês realizam obras residenciais e comerciais?",
    answer: "Sim. Realizamos desde remodelações de apartamentos e moradias até à construção e adaptação de espaços comerciais, escritórios, consultórios e armazéns industriais.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-zinc-950 border-b border-zinc-800 relative overflow-hidden">
      {/* Background glow sutil */}
      <div className="absolute top-1/2 -left-28 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Tire Suas Dúvidas
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Informações claras sobre o nosso processo de trabalho, contratação e garantias.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden transition-colors hover:border-zinc-700 shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-amber-400" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default FAQSection;

"use client";

import { motion } from "framer-motion";
import { Hammer, Building2, Paintbrush, Wrench, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export function ServicesSection() {
  const { messages } = useLanguage();
  const services = [
    {
      icon: <Hammer className="w-7 h-7" />,
      ...messages.services.items[0],
    },
    {
      icon: <Building2 className="w-7 h-7" />,
      ...messages.services.items[1],
    },
    {
      icon: <Paintbrush className="w-7 h-7" />,
      ...messages.services.items[2],
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      ...messages.services.items[3],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="servicos" className="py-24 px-6 bg-zinc-900/40 border-b border-zinc-800 relative overflow-hidden">
      {/* Background glow sutil */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
            {messages.services.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
            {messages.services.title}
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            {messages.services.description}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((serv, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, borderColor: "rgba(245, 158, 11, 0.55)" }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-300 group shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

              <div>
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all shadow-md"
                >
                  {serv.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {serv.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {serv.description}
                </p>
                <div className="space-y-2.5 pt-4 border-t border-zinc-800/80">
                  {serv.details.map((it, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 flex justify-between items-center text-xs">
                <span className="text-zinc-500">{messages.services.labor}</span>
                <a
                  href="#orcamento"
                  className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  {messages.services.consult} &rarr;
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default ServicesSection;

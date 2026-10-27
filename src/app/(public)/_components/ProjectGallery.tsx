"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Layers, X, ArrowRight } from "lucide-react";

type Category = "Todas" | "Reformas" | "Construção de Raiz" | "Interiores" | "Acabamentos";

interface ProjectItem {
  id: string;
  title: string;
  category: "Reformas" | "Construção de Raiz" | "Interiores" | "Acabamentos";
  location: string;
  image: string;
  description: string;
}

const defaultProjects: ProjectItem[] = [
  {
    id: "1",
    title: "Remodelação Integral de Apartamento T3",
    category: "Interiores",
    location: "Parque das Nações, Lisboa",
    image: "/image/projeto-residencial.jpeg",
    description: "Conversão completa de áreas sociais em open-space com iluminação arquitetónica e carpintaria lacada à medida.",
  },
  {
    id: "2",
    title: "Moradia Unifamiliar Contemporânea",
    category: "Construção de Raiz",
    location: "Cascais, Portugal",
    image: "/image/obra.jpeg",
    description: "Construção estrutural em betão armado, isolamento térmico pelo exterior (sistema ETICS/Capoto) e caixilharia de corte térmico.",
  },
  {
    id: "3",
    title: "Reabilitação de Espaço Comercial & Escritórios",
    category: "Reformas",
    location: "Avenida da Liberdade, Lisboa",
    image: "/image/projeto-comercial.jpeg",
    description: "Revisão integral de sistemas elétricos, divisórias em pladur acústico e pavimentos vinílicos de tráfego intenso.",
  },
  {
    id: "4",
    title: "Cozinha Moderna com Ilha em Quartzo",
    category: "Interiores",
    location: "Oeiras, Portugal",
    image: "/image/quem-somos.jpeg",
    description: "Mobiliário planeado termolaminado anti-dedadas, bancadas em quartzo compósito e eletrodomésticos encastrados.",
  },
  {
    id: "5",
    title: "Estrutura & Pavimento Industrial",
    category: "Construção de Raiz",
    location: "Sintra, Portugal",
    image: "/image/projeto-industrial.jpeg",
    description: "Pavimento contínuo de betão afagado com endurecedor superficial e drenagem técnica pluvial.",
  },
  {
    id: "6",
    title: "Pinturas & Impermeabilização de Cobertura",
    category: "Acabamentos",
    location: "Almada, Margem Sul",
    image: "/image/obra.jpeg",
    description: "Aplicação de telas asfálticas cruzadas, impermeabilização de juntas e acabamentos com tinta elástica 100% acrílica.",
  },
];

export function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todas");
  const [selectedImage, setSelectedImage] = useState<ProjectItem | null>(null);

  const categories: Category[] = [
    "Todas",
    "Reformas",
    "Construção de Raiz",
    "Interiores",
    "Acabamentos",
  ];

  const filteredProjects =
    activeCategory === "Todas"
      ? defaultProjects
      : defaultProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="galeria" className="py-24 px-6 bg-zinc-900/60 border-b border-zinc-800 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Cabeçalho da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Layers className="w-3.5 h-3.5" />
            Portfólio & Obra Executada
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Galeria de Projetos Recentes
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Veja exemplos reais de obras e intervenções estruturais realizadas com o rigor de engenharia da Severino Remodelações.
          </p>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                  activeCategory === cat
                    ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid de Projetos */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                whileHover={{ y: -6, borderColor: "rgba(245, 158, 11, 0.55)" }}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-colors shadow-xl flex flex-col"
              >
                <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-amber-400 text-[11px] font-bold tracking-wide uppercase shadow-sm">
                      {project.category}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage(project)}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-amber-500 text-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-amber-400 cursor-pointer flex items-center justify-center"
                    title="Ampliar visualização"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-amber-500/90 font-medium block mb-1">
                      {project.location}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Severino Remodelações</span>
                    <a
                      href="#orcamento"
                      className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Pedir similar &rarr;
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal de Detalhe da Obra com AnimatePresence */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-950/70 hover:bg-zinc-950 text-white/80 hover:text-white transition-colors cursor-pointer border border-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative h-72 sm:h-96 w-full bg-zinc-950">
                  <Image
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{selectedImage.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{selectedImage.location}</p>
                  <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{selectedImage.description}</p>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Fechar
                    </button>
                    <a
                      href="#orcamento"
                      onClick={() => setSelectedImage(null)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      Solicitar Orçamento Deste Tipo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
export default ProjectGallery;

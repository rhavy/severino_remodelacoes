"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Layers, X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

type ProjectItem = {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
};

const categoryTranslationIndex: Record<string, number> = {
  reformas: 1,
  "reformas gerais": 1,
  construções: 2,
  "construção de raiz": 2,
  interiores: 3,
  residencial: 3,
  comercial: 3,
  industrial: 3,
  acabamentos: 4,
  "pinturas & acabamentos": 4,
};

export function ProjectGallery() {
  const { messages } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch("/api/galeria", { signal: controller.signal });
        if (!response.ok) throw new Error("Falha ao carregar os projetos.");
        const items: ProjectItem[] = await response.json();
        setProjects(items);
      } catch {
        if (!controller.signal.aborted) setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProjects();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ["all", ...new Set(projects.map((project) => project.category))],
    [projects]
  );
  const categoryLabel = (category: string) => {
    if (category === "all") return messages.gallery.categories[0];
    const translationIndex = categoryTranslationIndex[category.trim().toLocaleLowerCase()];
    return translationIndex === undefined
      ? category
      : messages.gallery.categories[translationIndex];
  };
  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="galeria" className="relative overflow-hidden border-b border-zinc-800 bg-zinc-900/60 px-4 py-16 sm:px-6 sm:py-24">
      <div className="container relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Layers className="h-3.5 w-3.5" />
            {messages.gallery.badge}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {messages.gallery.title}
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            {messages.gallery.description}
          </p>

          {categories.length > 1 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setActiveCategory(category)}
                  className={`relative rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                    activeCategory === category
                      ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {categoryLabel(category)}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="py-16 text-center text-sm text-zinc-400">A carregar projetos...</div>
        ) : loadError ? (
          <div role="alert" className="py-16 text-center text-sm text-red-300">
            Não foi possível carregar a galeria neste momento.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-400">
            Ainda não existem projetos publicados nesta galeria.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  whileHover={{ y: -6, borderColor: "rgba(245, 158, 11, 0.55)" }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl transition-colors"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-950 sm:h-60">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-85 transition-opacity group-hover:opacity-60" />
                    <span className="absolute left-3 top-3 rounded-md border border-zinc-800 bg-zinc-950/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-400 shadow-sm backdrop-blur-md">
                      {categoryLabel(project.category)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(project)}
                      className="absolute bottom-3 right-3 flex items-center justify-center rounded-xl bg-amber-500 p-2.5 text-zinc-950 shadow-lg transition hover:bg-amber-400 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                      title={messages.gallery.enlarge}
                      aria-label={`${messages.gallery.enlarge}: ${project.title}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <span className="mb-1 block text-xs font-medium text-amber-500/90">
                        {project.location}
                      </span>
                      <h3 className="font-bold text-white transition-colors group-hover:text-amber-400">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-zinc-400">
                        {project.description}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs">
                      <span className="text-zinc-500">Severino Remodelações</span>
                      <a
                        href="#orcamento"
                        className="inline-flex items-center gap-1 font-semibold text-amber-400 transition-transform hover:translate-x-1 hover:text-amber-300"
                      >
                        {messages.gallery.similar}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  aria-label={messages.gallery.close}
                  className="absolute right-3 top-3 z-10 rounded-full border border-zinc-700 bg-zinc-950/80 p-2 text-white transition hover:bg-zinc-950 sm:right-4 sm:top-4"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="relative h-56 w-full bg-zinc-950 sm:h-96">
                  <Image
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    fill
                    sizes="(max-width: 672px) 100vw, 672px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase text-amber-400">
                    {categoryLabel(selectedImage.category)}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white">{selectedImage.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{selectedImage.location}</p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                    {selectedImage.description}
                  </p>
                  <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="rounded-xl bg-zinc-800 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-zinc-700"
                    >
                      {messages.gallery.close}
                    </button>
                    <a
                      href="#orcamento"
                      onClick={() => setSelectedImage(null)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400"
                    >
                      {messages.gallery.request}
                      <ArrowRight className="h-3.5 w-3.5" />
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

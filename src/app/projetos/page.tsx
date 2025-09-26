"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "@/components/template/menu/page";
import { Footer } from "@/components/template/footer/page";
import { Home, Hammer, Paintbrush, Quote, X, ChevronLeft, ChevronRight } from "lucide-react";

type ItemGaleria = {
  id: string;
  url: string;
  categoria: string;
  oculta?: boolean;
};

export default function ProjetosPage() {
  const [galeria, setGaleria] = useState<ItemGaleria[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: number }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Buscar galeria
  useEffect(() => {
    fetch("/api/galeria")
      .then((res) => res.json())
      .then((data: ItemGaleria[]) => {
        const visibles = data.filter((item) => !item.oculta);
        setGaleria(visibles);
      })
      .catch((err) => console.error("Erro ao buscar galeria:", err));
  }, []);

  // Agrupar por categoria
  const categorias = Array.from(new Set(galeria.map((item) => item.categoria)));

  const openModal = (categoria: string, index: number) => {
    setCurrentCategoria(categoria);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const nextImage = () => {
    if (!currentCategoria) return;
    const items = galeria.filter((item) => item.categoria === currentCategoria);
    setCurrentImageIndex((currentImageIndex + 1) % items.length);
  };

  const prevImage = () => {
    if (!currentCategoria) return;
    const items = galeria.filter((item) => item.categoria === currentCategoria);
    setCurrentImageIndex((currentImageIndex - 1 + items.length) % items.length);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) prevImage();
    else if (info.offset.x < -threshold) nextImage();
  };

  const loadMoreImages = (categoria: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [categoria]: (prev[categoria] || 6) + 3,
    }));
  };

  return (
    <main className="flex flex-col flex-1">
      {/* Header */}
      <header className="w-full shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <nav
            className="px-6 py-4 flex items-center justify-between w-full mx-auto gap-6 fixed top-0 left-0 right-0 bg-white shadow z-50"
            role="navigation"
          >
            <Menu
              menuLinks={[
                { link: "/", titulo: "Início", icon: <Home size={18} /> },
                { link: "/projetos", titulo: "Projetos", icon: <Hammer size={18} /> },
                { link: "/servicos", titulo: "Serviços", icon: <Paintbrush size={18} /> },
                { link: "/contato", titulo: "Contato", icon: <Quote size={18} /> },
              ]}
            />
          </nav>
        </div>
      </header>

      {/* Banner */}
      <motion.section
        className="flex flex-col items-center justify-center bg-gray-50 px-6 py-24 text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Nossos Projetos
        </h1>
        <p className="text-gray-700 max-w-2xl mb-6">
          Explore os projetos que realizamos, mostrando nosso compromisso com qualidade, inovação e eficiência na construção civil.
        </p>
        <Link
          href="/contato"
          className="rounded-lg bg-yellow-500 px-8 py-4 text-white font-medium hover:bg-yellow-600 transition"
        >
          Solicitar Orçamento
        </Link>
      </motion.section>

      {/* Grid de Projetos */}
      <section className="container mx-auto px-6 py-20 space-y-20">
        {categorias.map((categoria) => {
          const items = galeria.filter((item) => item.categoria === categoria);
          const visibleCount = loadedImages[categoria] || 6;
          const visibleItems = items.slice(0, visibleCount);

          return (
            <motion.div
              key={categoria}
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-yellow-600 mb-4">{categoria}</h2>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                {visibleItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => openModal(categoria, i)}
                  >
                    <Image
                      src={item.url}
                      alt={`${categoria} ${i + 1}`}
                      width={400}
                      height={300}
                      className="object-cover w-full rounded-xl shadow-md"
                    />
                  </motion.div>
                ))}
              </div>

              {visibleCount < items.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => loadMoreImages(categoria)}
                    className="inline-block rounded-lg bg-yellow-500 px-6 py-3 text-white font-medium hover:bg-yellow-600 transition"
                  >
                    Ver Mais
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </section>

      {/* Modal de imagens */}
      <AnimatePresence>
        {modalOpen && currentCategoria && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl w-full mx-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white text-3xl hover:text-yellow-400 transition"
                onClick={closeModal}
              >
                <X size={32} />
              </button>

              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-4xl p-2 hover:text-yellow-400 transition"
                onClick={prevImage}
              >
                <ChevronLeft size={40} />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-4xl p-2 hover:text-yellow-400 transition"
                onClick={nextImage}
              >
                <ChevronRight size={40} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-semibold bg-black/50 px-4 py-1 rounded-full">
                {currentImageIndex + 1}/{
                  galeria.filter((item) => item.categoria === currentCategoria).length
                }
              </div>

              <motion.div
                key={currentImageIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Image
                  src={
                    galeria.filter((item) => item.categoria === currentCategoria)[
                      currentImageIndex
                    ].url
                  }
                  alt={`${currentCategoria} ${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="rounded-xl object-contain w-full max-h-[80vh] mx-auto"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA final */}
      <motion.section
        className="px-6 py-20 bg-gray-50 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Pronto para transformar seu espaço?
        </h2>
        <p className="text-gray-700 mb-8">
          Entre em contato agora e peça seu orçamento sem compromisso.
        </p>
        <Link
          href="/contato"
          className="rounded-lg bg-yellow-500 px-8 py-4 text-white font-medium hover:bg-yellow-600 transition"
        >
          Solicitar Orçamento
        </Link>
      </motion.section>

      <Footer />
    </main>
  );
}

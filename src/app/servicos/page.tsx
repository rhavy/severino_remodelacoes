"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import { Menu } from "@/components/template/menu/page";
import { Footer } from "@/components/template/footer/page";
import { Home, Hammer, Paintbrush, Quote, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Categoria =
  | "Residencial"
  | "Comercial"
  | "Industrial"
  | "Reformas"
  | "Construções"
  | "Acabamentos"
  | "Manutenção Predial";

type ItemGaleria = {
  id: string;
  url: string;
  categoria: Categoria;
  oculta?: boolean;
};

export default function ServicosPage() {
  const [gallery, setGallery] = useState<ItemGaleria[]>([]);
  const [modal, setModal] = useState<{ src: string; images: string[]; index: number } | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, number>>({});

  const categoriasPermitidas: Categoria[] = [
    "Reformas",
    "Construções",
    "Acabamentos",
    "Manutenção Predial",
  ];

  // Buscar galeria do backend
  useEffect(() => {
    fetch("/api/galeria")
      .then((res) => res.json())
      .then((data: ItemGaleria[]) => {
        // filtrar apenas categorias permitidas e não ocultas
        const filtrada = data.filter(
          (item) => categoriasPermitidas.includes(item.categoria) && !item.oculta
        );

        setGallery(filtrada);

        // inicializar contador de imagens carregadas por categoria
        const initialLoaded: Record<string, number> = {};
        categoriasPermitidas.forEach((cat) => {
          initialLoaded[cat] = filtrada.filter((i) => i.categoria === cat).length > 6 ? 6 : filtrada.filter((i) => i.categoria === cat).length;
        });
        setLoadedImages(initialLoaded);
      })
      .catch((err) => console.error(err));
  }, []);

  const openModal = (categoria: Categoria, index: number) => {
    const imgs = gallery.filter((item) => item.categoria === categoria).map((i) => i.url);
    setModal({ src: imgs[index], images: imgs, index });
  };

  const closeModal = () => setModal(null);
  const nextImage = () => {
    if (!modal) return;
    const nextIndex = (modal.index + 1) % modal.images.length;
    setModal({ ...modal, src: modal.images[nextIndex], index: nextIndex });
  };
  const prevImage = () => {
    if (!modal) return;
    const prevIndex = (modal.index - 1 + modal.images.length) % modal.images.length;
    setModal({ ...modal, src: modal.images[prevIndex], index: prevIndex });
  };

  const loadMoreImages = (categoria: Categoria) => {
    setLoadedImages((prev) => {
      const total = gallery.filter((i) => i.categoria === categoria).length;
      const current = prev[categoria] || 6;
      const newCount = Math.min(current + 6, total);
      return { ...prev, [categoria]: newCount };
    });
  };

  return (
    <main className="flex flex-col flex-1">
      {/* Header fixo */}
      <header className="w-full shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <nav className="px-6 py-4 flex items-center justify-between w-full mx-auto gap-6 fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 shadow z-50" role="navigation">
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
          Nossos Serviços
        </h1>
        <p className="text-gray-700 max-w-2xl mb-6">
          Explore os serviços que oferecemos, mostrando nosso compromisso com qualidade, inovação e eficiência.
        </p>
        <Link
          href="/contato"
          className="rounded-lg bg-yellow-500 px-8 py-4 text-white font-medium hover:bg-yellow-600 transition"
        >
          Solicitar Orçamento
        </Link>
      </motion.section>

      {/* Grid por categoria */}
      <section className="container mx-auto px-6 py-20 space-y-20">
        {categoriasPermitidas.map((cat) => {
          const imagens = gallery.filter((i) => i.categoria === cat).slice(0, loadedImages[cat] || 6);
          if (imagens.length === 0) return null;

          return (
            <motion.div key={cat} className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-yellow-600 mb-4">{cat}</h2>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                {imagens.map((img, i) => (
                  <motion.div
                    key={img.id}
                    className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => openModal(cat, i)}
                  >
                    <Image
                      src={img.url}
                      alt={`${cat} ${i + 1}`}
                      width={400}
                      height={300}
                      className="object-cover w-full rounded-xl shadow-md"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Botão carregar mais imagens */}
              {loadedImages[cat] < gallery.filter((i) => i.categoria === cat).length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => loadMoreImages(cat)}
                    className="inline-block rounded-lg bg-yellow-500 px-6 py-3 text-white font-medium hover:bg-yellow-600 transition"
                  >
                    Carregar Mais
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </section>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl w-full mx-4 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 text-white z-50 hover:text-yellow-400 transition" onClick={closeModal}>
                <X size={32} />
              </button>
              <button className="absolute left-4 text-white z-50 hover:text-yellow-400 transition" onClick={prevImage}>
                <ChevronLeft size={48} />
              </button>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-lg z-50 font-medium">
                {modal.index + 1} / {modal.images.length}
              </div>
              <Image src={modal.src} alt="Visualização" width={800} height={600} className="rounded-xl object-contain w-full h-full" />
              <button className="absolute right-4 text-white z-50 hover:text-yellow-400 transition" onClick={nextImage}>
                <ChevronRight size={48} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA final */}
      <motion.section className="px-6 py-20 bg-gray-50 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Pronto para transformar seu espaço?</h2>
        <p className="text-gray-700 mb-8">Entre em contato agora e peça seu orçamento sem compromisso.</p>
        <Link href="/contato" className="rounded-lg bg-yellow-500 px-8 py-4 text-white font-medium hover:bg-yellow-600 transition">
          Solicitar Orçamento
        </Link>
      </motion.section>

      <Footer />
    </main>
  );
}

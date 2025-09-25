"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import InfiniteScroll from "react-infinite-scroll-component"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Footer } from "../comonents/template/footer/page"
import { Menu } from "../comonents/template/menu/page"
import Link from "next/link"
import { Home, Hammer, Paintbrush, Quote } from "lucide-react"

export default function GaleriaPage() {
  const searchParams = useSearchParams()
  const servicoQuery = searchParams.get("servico") || ""

  const [modal, setModal] = useState<{ src: string; images: string[]; index: number } | null>(null)
  const [items, setItems] = useState<string[]>(() => getInitialImages(servicoQuery))

  const servicos: Record<string, { titulo: string; imagens: string[] }> = {
    reformas: { titulo: "Reformas", imagens: Array.from({ length: 20 }, (_, i) => `/image/reformas-${(i % 5) + 1}.jpeg`) },
    construcoes: { titulo: "Construções", imagens: Array.from({ length: 20 }, (_, i) => `/image/construcoes-${(i % 5) + 1}.jpeg`) },
    acabamentos: { titulo: "Acabamentos", imagens: Array.from({ length: 20 }, (_, i) => `/image/acabamentos-${(i % 5) + 1}.jpeg`) },
    manutencao: { titulo: "Manutenção Predial", imagens: Array.from({ length: 20 }, (_, i) => `/image/manutencao-${(i % 5) + 1}.jpeg`) },
  }

  const servico = servicos[servicoQuery.toLowerCase()] || { titulo: "Serviço", imagens: [] }

  function getInitialImages(servicoName: string) {
    return servicos[servicoName]?.imagens.slice(0, 6) || []
  }

  const fetchMoreData = () => {
    const currentLength = items.length
    const more = servico.imagens.slice(currentLength, currentLength + 6)
    setItems([...items, ...more])
  }

  const openModal = (img: string, images: string[], index: number) => {
    setModal({ src: img, images, index })
  }

  const nextImage = () => {
    if (!modal) return
    const nextIndex = (modal.index + 1) % modal.images.length
    setModal({ src: modal.images[nextIndex], images: modal.images, index: nextIndex })
  }

  const prevImage = () => {
    if (!modal) return
    const prevIndex = (modal.index - 1 + modal.images.length) % modal.images.length
    setModal({ src: modal.images[prevIndex], images: modal.images, index: prevIndex })
  }

  return (
    <main className="flex flex-col flex-1">
      {/* Header fixo */}
      <header className="w-full bg-gray-900 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <nav
            className="px-6 py-4 flex items-center justify-between w-full mx-auto gap-6 fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 shadow z-50"
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
          Galeria de {servico.titulo}
        </h1>
        <p className="text-gray-700 max-w-2xl mb-6">
          Aqui estão alguns exemplos de trabalhos realizados em {servico.titulo.toLowerCase()}.
        </p>
        <Link
          href="/servicos"
          className="rounded-lg bg-yellow-500 px-8 py-4 text-white font-medium hover:bg-yellow-600 transition"
        >
          Voltar aos Serviços
        </Link>
      </motion.section>

      {/* Galeria com Masonry e Infinite Scroll */}
      <section className="container mx-auto px-6 py-20">
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={items.length < servico.imagens.length}
          loader={<p className="text-center text-gray-500 mt-4">Carregando mais imagens...</p>}
        >
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
            {items.map((img, i) => (
              <motion.div
                key={i}
                className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                onClick={() => openModal(img, items, i)}
              >
                <Image
                  src={img}
                  alt={`${servico.titulo} ${i + 1}`}
                  width={400}
                  height={300}
                  className="object-cover w-full rounded-xl shadow-md"
                  priority
                />
              </motion.div>
            ))}
          </div>
        </InfiniteScroll>
      </section>

      {/* Modal Slideshow */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-4xl w-full mx-4 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-white z-50"
              >
                <X size={32} />
              </button>

              <button
                onClick={prevImage}
                className="absolute left-4 text-white z-50"
              >
                <ChevronLeft size={48} />
              </button>

              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-lg z-50 font-medium">
                {modal.index + 1} / {modal.images.length}
              </div>

              <Image
                src={modal.src}
                alt="Visualização"
                width={800}
                height={600}
                className="rounded-xl object-contain w-full h-full"
                priority
              />

              <button
                onClick={nextImage}
                className="absolute right-4 text-white z-50"
              >
                <ChevronRight size={48} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}

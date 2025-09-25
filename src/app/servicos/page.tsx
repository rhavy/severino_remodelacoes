"use client"

import { useState } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import Image from "next/image"
import { Menu } from "@/comonents/template/menu/page"
import { Footer } from "@/comonents/template/footer/page"
import { Home, Hammer, Paintbrush, Quote, X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ServicosPage() {
  const servicos = [
    {
      slug: "reformas",
      titulo: "Reformas",
      descricao: "Reformas residenciais e comerciais com alto padrão de qualidade e entrega dentro do prazo.",
      imagens: Array.from({ length: 20 }, (_, i) => `/image/reformas-${(i % 5) + 1}.jpeg`),
    },
    {
      slug: "construcoes",
      titulo: "Construções",
      descricao: "Projetos completos de construção civil, do planejamento à execução.",
      imagens: Array.from({ length: 20 }, (_, i) => `/image/construcoes-${(i % 5) + 1}.jpeg`),
    },
    {
      slug: "acabamentos",
      titulo: "Acabamentos",
      descricao: "Pintura, revestimento e acabamentos finos para deixar seu espaço ainda mais sofisticado.",
      imagens: Array.from({ length: 20 }, (_, i) => `/image/acabamentos-${(i % 5) + 1}.jpeg`),
    },
    {
      slug: "manutencao",
      titulo: "Manutenção Predial",
      descricao: "Serviços de manutenção predial preventiva e corretiva para garantir segurança e conservação.",
      imagens: Array.from({ length: 20 }, (_, i) => `/image/manutencao-${(i % 5) + 1}.jpeg`),
    },
  ]

  const [modal, setModal] = useState<{ src: string; images: string[]; index: number } | null>(null)
  const [loadedImages, setLoadedImages] = useState<Record<string, number>>(
    servicos.reduce((acc, s) => ({ ...acc, [s.slug]: 6 }), {})
  )

  const openModal = (projSlug: string, index: number) => {
    const project = servicos.find(s => s.slug === projSlug)!
    setModal({ src: project.imagens[index], images: project.imagens.slice(0, loadedImages[projSlug]), index })
  }

  const closeModal = () => setModal(null)
  const nextImage = () => {
    if (!modal) return
    const nextIndex = (modal.index + 1) % modal.images.length
    setModal({ ...modal, src: modal.images[nextIndex], index: nextIndex })
  }
  const prevImage = () => {
    if (!modal) return
    const prevIndex = (modal.index - 1 + modal.images.length) % modal.images.length
    setModal({ ...modal, src: modal.images[prevIndex], index: prevIndex })
  }

  const loadMoreImages = (slug: string) => {
    setLoadedImages(prev => {
      const project = servicos.find(s => s.slug === slug)!
      const newCount = Math.min(prev[slug] + 6, project.imagens.length)
      return { ...prev, [slug]: newCount }
    })
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

      {/* Lista de Serviços com mini-galeria */}
      <section className="container mx-auto px-6 py-20 space-y-20">
        {servicos.map((servico, idx) => {
          const visibleImages = servico.imagens.slice(0, loadedImages[servico.slug])
          return (
            <motion.div
              key={servico.slug}
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-400 mb-4">{servico.titulo}</h2>
              <p className="text-gray-300 mb-6">{servico.descricao}</p>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                {visibleImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => openModal(servico.slug, i)}
                  >
                    <Image
                      src={img}
                      alt={`${servico.titulo} ${i + 1}`}
                      width={400}
                      height={300}
                      className="object-cover w-full rounded-xl shadow-md"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Botão carregar mais imagens */}
              {loadedImages[servico.slug] < servico.imagens.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => loadMoreImages(servico.slug)}
                    className="inline-block rounded-lg bg-yellow-500 px-6 py-3 text-white font-medium hover:bg-yellow-600 transition"
                  >
                    Carregar Mais
                  </button>
                </div>
              )}
            </motion.div>
          )
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
              <button
                className="absolute top-4 right-4 text-white z-50"
                onClick={closeModal}
              >
                <X size={32} />
              </button>

              <button
                className="absolute left-4 text-white z-50"
                onClick={prevImage}
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
              />

              <button
                className="absolute right-4 text-white z-50"
                onClick={nextImage}
              >
                <ChevronRight size={48} />
              </button>
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
        <p className="text-gray-600 mb-8">
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
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "@/comonents/template/menu/page"
import { Footer } from "@/comonents/template/footer/page"
import { Home, Hammer, Paintbrush, Quote, X, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProjetosPage() {
  const projetos = [
    {
      slug: "residencial",
      tipo: "Residencial",
      titulo: "Condomínio Residencial Moderno",
      desc: "Projeto residencial exemplifica nosso compromisso com ambientes acolhedores, funcionais e esteticamente refinados.",
      imagens: Array.from({ length: 12 }, (_, i) => `/image/projeto-residencial-${(i % 5) + 1}.jpeg`)
    },
    {
      slug: "comercial",
      tipo: "Comercial",
      titulo: "Edifício Comercial Inteligente",
      desc: "O projeto comercial reflete soluções inteligentes voltadas à eficiência operacional e à valorização da marca.",
      imagens: Array.from({ length: 12 }, (_, i) => `/image/projeto-comercial-${(i % 5) + 1}.jpeg`)
    },
    {
      slug: "industrial",
      tipo: "Industrial",
      titulo: "Galpão Industrial Robusto",
      desc: "Projeto industrial demonstra nossa capacidade de desenvolver estruturas seguras e otimizadas para processos produtivos.",
      imagens: Array.from({ length: 12 }, (_, i) => `/image/projeto-industrial-${(i % 5) + 1}.jpeg`)
    },
  ]

  const [modalOpen, setModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: number }>({})

  const openModal = (projectIndex: number, imageIndex: number) => {
    setCurrentProject(projectIndex)
    setCurrentImageIndex(imageIndex)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const nextImage = () => {
    if (currentProject === null) return
    const images = projetos[currentProject].imagens
    setCurrentImageIndex((currentImageIndex + 1) % images.length)
  }

  const prevImage = () => {
    if (currentProject === null) return
    const images = projetos[currentProject].imagens
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) prevImage()
    else if (info.offset.x < -threshold) nextImage()
  }

  // Infinite scroll loader
  const loadMoreImages = (slug: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [slug]: (prev[slug] || 6) + 3 // carrega 3 imagens adicionais por vez
    }))
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

      {/* Grid de Projetos com mini-galeria e botão "Ver Mais" */}
      <section className="container mx-auto px-6 py-20 space-y-20">
        {projetos.map((proj, projectIndex) => {
          const visibleCount = loadedImages[proj.slug] || 6
          const visibleImages = proj.imagens.slice(0, visibleCount)

          return (
            <motion.div
              key={proj.tipo}
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: projectIndex * 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-400 mb-4">{proj.titulo}</h2>
              <p className="text-gray-300 mb-6">{proj.desc}</p>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                {visibleImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className="mb-4 break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => openModal(projectIndex, i)}
                  >
                    <Image
                      src={img}
                      alt={`${proj.titulo} ${i + 1}`}
                      width={400}
                      height={300}
                      className="object-cover w-full rounded-xl shadow-md"
                    />
                  </motion.div>
                ))}
              </div>

              {visibleCount < proj.imagens.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => loadMoreImages(proj.slug)}
                    className="inline-block rounded-lg bg-yellow-500 px-6 py-3 text-white font-medium hover:bg-yellow-600 transition"
                  >
                    Ver Mais
                  </button>
                </div>
              )}
            </motion.div>
          )
        })}
      </section>

      {/* Modal de imagens */}
      <AnimatePresence>
        {modalOpen && currentProject !== null && (
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
                className="absolute top-4 right-4 text-white text-3xl"
                onClick={closeModal}
              >
                <X size={32} />
              </button>

              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-4xl p-2"
                onClick={prevImage}
              >
                <ChevronLeft size={40} />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-4xl p-2"
                onClick={nextImage}
              >
                <ChevronRight size={40} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-semibold bg-black/50 px-4 py-1 rounded-full">
                {currentImageIndex + 1}/{projetos[currentProject].imagens.length}
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
                  src={projetos[currentProject].imagens[currentImageIndex]}
                  alt={`${projetos[currentProject].titulo} ${currentImageIndex + 1}`}
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

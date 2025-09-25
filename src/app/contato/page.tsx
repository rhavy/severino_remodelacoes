"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, MapPin, Home, Hammer, Paintbrush, Quote } from "lucide-react"
import { EnvelopeIcon } from "@phosphor-icons/react"
import { Menu } from "@/comonents/template/menu/page"
import { Footer } from "@/comonents/template/footer/page"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  })
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // simulação
      setStatus("success")
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" })
    } catch {
      setStatus("error")
    }
  }

  return (
    <main className="flex flex-col flex-1">
      {/* Header */}
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

      {/* Hero Contact */}
      <section className="bg-yellow-500 py-20 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Quer tirar dúvidas, solicitar orçamento ou conversar sobre seu projeto? Preencha o formulário ou utilize nossos canais de contato.
          </p>
        </motion.div>
      </section>

      {/* Form & Info */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="container mx-auto max-w-4xl grid gap-16 md:grid-cols-2">
          {/* Formulário */}
          <motion.form
            className="bg-white shadow-lg rounded-xl p-8 grid gap-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
            type="text"
            name="assunto"
            placeholder="Assunto"
            value={formData.assunto}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <textarea
            name="mensagem"
            placeholder="Mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            required
            rows={5}
            className="border border-gray-300 rounded px-4 py-2 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded transition"
            >
              Enviar Mensagem
            </button>
            {status === "success" && (
              <p className="text-green-600 font-semibold">Mensagem enviada com sucesso!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-semibold">Erro ao enviar a mensagem. Tente novamente.</p>
            )}
          </motion.form>

          {/* Informações */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
              <EnvelopeIcon size={24} className="text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <a href="mailto:contato@severinoremoldacoes.com" className="text-gray-700 hover:text-yellow-500 transition">
                  contato@severinoremoldacoes.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
              <Phone className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Telefone</h3>
                <a href="tel:+55027999999999" className="text-gray-700 hover:text-yellow-500 transition">
                  +55 27 99999-9999
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
              <MapPin className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Endereço</h3>
                <p className="text-gray-700">
                  Av. Exemplo, 123 - Vitória, ES, Brasil
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

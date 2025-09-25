"use client"

import { Building2, Hammer, Home, Paintbrush, Quote } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Menu } from "@/comonents/template/menu/page"
import { Header } from "@/comonents/template/header/page"
import { Footer } from "@/comonents/template/footer/page"

export default function HomePage() {
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

      {/* Hero */}
      <Header />

      {/* Serviços */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-400 mb-12">
          Nossos Serviços
        </h2>
        <motion.div
          className="grid gap-8 md:grid-cols-3 text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {[
            {
              icon: <Hammer className="h-12 w-12 mx-auto text-yellow-500 mb-4" />,
              titulo: "Reformas",
              desc: "Reformas residenciais e comerciais com alto padrão de qualidade e entrega dentro do prazo.",
            },
            {
              icon: <Home className="h-12 w-12 mx-auto text-yellow-500 mb-4" />,
              titulo: "Construções",
              desc: "Projetos completos de construção civil, do planejamento à execução.",
            },
            {
              icon: <Paintbrush className="h-12 w-12 mx-auto text-yellow-500 mb-4" />,
              titulo: "Acabamentos",
              desc: "Pintura, revestimento e acabamentos finos para deixar seu espaço ainda mais sofisticado.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-xl shadow hover:shadow-lg transition border-t-4 border-yellow-500"
              variants={{
                hidden: { opacity: 0, y: 50 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.titulo}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Sobre */}
      <section className="bg-gray-100 px-6 py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quem Somos</h2>
            <p className="text-gray-700 leading-relaxed">
              A <strong>Severino Remodelações</strong> atua há mais de 10 anos no setor da construção civil,
              oferecendo serviços de qualidade, transparência e comprometimento. Nosso time de profissionais
              é altamente capacitado e pronto para transformar sua ideia em realidade.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Nosso diferencial está no cuidado com cada detalhe, buscando sempre superar as expectativas
              dos clientes.
            </p>
          </motion.div>
          <motion.img
            src="/image/quem-somos.jpeg"
            alt="Equipe de construção"
            className="rounded-xl shadow-md"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Projetos */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-400 mb-12">
          Projetos em Destaque
        </h2>
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {["Residencial", "Comercial", "Industrial"].map((tipo, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Image
                  src={`/image/projeto-${tipo.toLowerCase()}.jpeg`}
                  alt={`Projeto ${tipo}`}
                  width={400}
                  height={300}
                  className="rounded-xl shadow-md object-cover"
                  priority
                />
              </motion.div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-yellow-600">
                  Projeto {tipo}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tipo === "Residencial" &&
                    "Este projeto residencial exemplifica nosso compromisso com ambientes acolhedores, funcionais e esteticamente refinados. A imagem apresentada é ilustrativa e busca transmitir o padrão de qualidade e atenção aos detalhes que aplicamos em cada lar construído."}
                  {tipo === "Comercial" &&
                    "O projeto comercial reflete soluções inteligentes voltadas à eficiência operacional e à valorização da marca no espaço físico. A imagem tem caráter ilustrativo e representa o estilo e os acabamentos que podem ser adaptados conforme as necessidades de cada cliente."}
                  {tipo === "Industrial" &&
                    "Este projeto industrial demonstra nossa capacidade de desenvolver estruturas robustas, seguras e otimizadas para processos produtivos. A imagem é meramente ilustrativa, servindo como referência visual para o padrão técnico e construtivo que oferecemos."}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Depoimentos */}
      <section className="bg-yellow-500 text-white px-6 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">O que dizem nossos clientes</h2>
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.3 } },
            }}
          >
            {[
              {
                msg: "Contratei a equipe para construir minha casa em Guarapari e fiquei impressionada com o cuidado em cada etapa. Tudo foi entregue dentro do prazo e com excelente acabamento.",
                nome: "Juliana M.",
                projeto: "Residencial",
                data: "fev/2025",
              },
              {
                msg: "Precisávamos reformar nossa loja em Vitória e o serviço foi impecável. Desde o planejamento até os últimos retoques, tudo foi feito com profissionalismo e atenção aos detalhes.",
                nome: "Carlos T.",
                projeto: "Comercial",
                data: "jun/2024",
              },
              {
                msg: "A construção do galpão industrial superou nossas expectativas. Estrutura sólida, equipe técnica competente e ótimo suporte durante todo o processo.",
                nome: "Fernanda R.",
                projeto: "Industrial",
                data: "out/2023",
              },
            ].map(({ msg, nome, projeto, data }, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-yellow-600 shadow-md"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Quote className="h-8 w-8 mx-auto mb-4 text-yellow-200" />
                <p className="italic mb-4">"{msg}"</p>
                <span className="font-semibold block">{nome}</span>
                <span className="text-sm text-yellow-200">
                  Projeto {projeto} – {data}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
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

      {/* Footer */}
      <Footer />
    </main>
  )
}

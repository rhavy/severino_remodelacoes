import { Hero } from "./_components/Hero";
import { ProjectGallery } from "./_components/ProjectGallery";
import ContactForm from "./_components/ContactForm";
import { AboutSection } from "./_components/AboutSection";
import { ServicesSection } from "./_components/ServicesSection";
import { FAQSection } from "./_components/FAQSection";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function HomePage() {
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351 912 345 678";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contato@severinoconstrucoes.pt";

  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Sobre Nós */}
      <AboutSection />

      {/* 3. Nossos Serviços */}
      <ServicesSection />

      {/* 4. Galeria de Projetos */}
      <ProjectGallery />

      {/* 5. Perguntas Frequentes (FAQ) */}
      <FAQSection />

      {/* 6. Contacto & Formulário de Orçamento */}
      <section id="contato" className="py-24 px-6 bg-zinc-950 relative">
        <div id="orcamento" className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Inicie a sua obra connosco
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Solicite a sua Visita Técnica & Orçamento
            </h2>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base">
              Preencha o formulário detalhado abaixo ou fale diretamente connosco através dos nossos contactos oficiais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Informações de contacto diretas */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Telefone Oficial</h4>
                <a
                  href={`tel:${companyPhone.replace(/[^0-9+]/g, "")}`}
                  className="text-amber-400 font-bold text-base hover:underline mt-1 block"
                >
                  {companyPhone}
                </a>
                <p className="text-xs text-zinc-400 mt-1">Disponível também por WhatsApp</p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">E-mail Comercial</h4>
                <a
                  href={`mailto:${companyEmail}`}
                  className="text-amber-400 font-bold text-sm hover:underline mt-1 block truncate"
                >
                  {companyEmail}
                </a>
                <p className="text-xs text-zinc-400 mt-1">Resposta em menos de 24 horas</p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Área de Atuação</h4>
                <p className="text-sm font-semibold text-zinc-200 mt-1">Lisboa, Margem Sul e Região Metropolitana</p>
                <p className="text-xs text-zinc-400 mt-1">Deslocação técnica para vistoria sem custo</p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Horário de Atendimento</h4>
                <p className="text-sm font-semibold text-zinc-200 mt-1">Segunda a Sábado &bull; 08:00 às 19:00</p>
              </div>
            </div>

            {/* Formulário Interativo */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

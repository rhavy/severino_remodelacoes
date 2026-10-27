import { FacebookLogoIcon, InstagramLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react/dist/ssr';

export function Footer() {
  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 text-gray-300">
      <div className="container mx-auto px-4">

        {/* Título */}
        <div className="border-b border-gray-600 pb-8 mb-8">
          <h4 className="text-3xl font-bold text-center text-amber-500">
            Severino Remodelações
          </h4>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Sobre a empresa */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Quem Somos</h3>
            <p className="mb-6 text-gray-400 leading-relaxed">
              A <strong className="text-white">Severino Remodelações</strong> é especializada em reformas e construções em geral, oferecendo
              soluções de excelência técnica e máxima solidez estrutural para habitações e espaços comerciais em Portugal.
            </p>
            <a
              href="#orcamento"
              className="inline-block bg-amber-500 hover:bg-amber-400 transition px-5 py-3 rounded-lg font-bold shadow-lg text-slate-950"
            >
              Solicitar Orçamento
            </a>
          </div>

          {/* Contactos */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Contactos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                Email:{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contato@severinoconstrucoes.pt"}`}
                  className="underline hover:text-amber-400"
                >
                  {process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contato@severinoconstrucoes.pt"}
                </a>
              </li>
              <li>
                Telefone:{" "}
                <a
                  href={`tel:${(process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351912345678").replace(/[^0-9+]/g, "")}`}
                  className="underline hover:text-amber-400"
                >
                  {process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351 912 345 678"}
                </a>
              </li>
              <li>Sede & Operações: Lisboa e Vale do Tejo, Portugal</li>
              <li>Atendimento: Seg - Sex (08:00 - 19:00)</li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Redes Sociais</h3>
            <div className="flex items-center gap-5 text-yellow-500">
              <a
                href="https://facebook.com/severinoremodelacoes"
                target="_blank"
                className="hover:scale-110 transform transition hover:text-white"
              >
                <FacebookLogoIcon className="w-8 h-8" />
              </a>
              <a
                href="https://instagram.com/severinoremodelacoes"
                target="_blank"
                className="hover:scale-110 transform transition hover:text-white"
              >
                <InstagramLogoIcon className="w-8 h-8" />
              </a>
              <a
                href="https://youtube.com/severinoremodelacoes"
                target="_blank"
                className="hover:scale-110 transform transition hover:text-white"
              >
                <YoutubeLogoIcon className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Severino Remodelações. Todos os direitos reservados.
        </div>
      </div>
    </section>
  );
}

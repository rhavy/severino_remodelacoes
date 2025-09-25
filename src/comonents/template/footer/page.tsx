import { FacebookLogoIcon, InstagramLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react/dist/ssr';

export function Footer() {
  return (
    <section className="bg-gradient-to-r from-gray-50 to-white py-16 text-black">
      <div className="container mx-auto px-4">

        {/* Título */}
        <div className="border-b border-gray-300 pb-8 mb-8">
          <h4 className="text-3xl font-bold text-center text-yellow-600">
            Severino Remodelações
          </h4>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Sobre a empresa */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Quem Somos</h3>
            <p className="mb-6 text-slate-700">
              A <strong>Severino Remodelações</strong> é especializada em reformas residenciais e comerciais, oferecendo
              soluções de qualidade em construção civil. Do planejamento à execução, entregamos ambientes renovados,
              seguros e funcionais para atender às suas necessidades.
            </p>
            <a
              href="https://wa.me/5511999999999?text=Olá, gostaria de solicitar um orçamento"
              target="_blank"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 transition px-5 py-3 rounded-lg font-medium shadow-lg text-white"
            >
              Solicitar Orçamento
            </a>
          </div>

          {/* Contatos */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contatos</h3>
            <ul className="space-y-2 text-slate-700">
              <li>
                Email:{" "}
                <a
                  href="mailto:contato@severinoremodelacoes.com"
                  className="underline hover:text-yellow-600"
                >
                  contato@severinoremodelacoes.com
                </a>
              </li>
              <li>
                Telefone:{" "}
                <a
                  href="tel:+5511999999999"
                  className="underline hover:text-yellow-600"
                >
                  +55 (11) 99999-9999
                </a>
              </li>
              <li>Endereço: Rua Exemplo, 123, São Paulo - SP</li>
              <li>CEP: 01234-567</li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Redes Sociais</h3>
            <div className="flex items-center gap-5 text-yellow-600">
              <a
                href="https://facebook.com/severinoremodelacoes"
                target="_blank"
                className="hover:scale-110 transform transition"
              >
                <FacebookLogoIcon className="w-8 h-8" />
              </a>
              <a
                href="https://instagram.com/severinoremodelacoes"
                target="_blank"
                className="hover:scale-110 transform transition"
              >
                <InstagramLogoIcon className="w-8 h-8" />
              </a>
              <a
                href="https://youtube.com/severinoremodelacoes"
                target="_blank"
                className="hover:scale-110 transform transition"
              >
                <YoutubeLogoIcon className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Severino Remodelações. Todos os direitos reservados.
        </div>
      </div>
    </section>
  );
}

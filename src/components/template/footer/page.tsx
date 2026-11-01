'use client';

import { FacebookLogoIcon, InstagramLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { messages } = useLanguage();

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
            <h3 className="text-2xl font-semibold mb-4 text-white">{messages.footer.about}</h3>
            <p className="mb-6 text-gray-400 leading-relaxed">
              {messages.footer.aboutText}
            </p>
            <a
              href="#orcamento"
              className="inline-block bg-amber-500 hover:bg-amber-400 transition px-5 py-3 rounded-lg font-bold shadow-lg text-slate-950"
            >
              {messages.footer.request}
            </a>
          </div>

          {/* Contactos */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">{messages.footer.contacts}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                {messages.footer.emailLabel}{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contato@severinoconstrucoes.pt"}`}
                  className="underline hover:text-amber-400"
                >
                  {process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contato@severinoconstrucoes.pt"}
                </a>
              </li>
              <li>
                {messages.footer.phoneLabel}{" "}
                <a
                  href={`tel:${(process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351912345678").replace(/[^0-9+]/g, "")}`}
                  className="underline hover:text-amber-400"
                >
                  {process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351 912 345 678"}
                </a>
              </li>
              <li>{messages.footer.headquarters}</li>
              <li>{messages.footer.schedule}</li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">{messages.footer.social}</h3>
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
          © {new Date().getFullYear()} Severino Remodelações. {messages.footer.rights}
        </div>
      </div>
    </section>
  );
}

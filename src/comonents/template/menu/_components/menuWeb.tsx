import LinksMenu from "./linksMenu"
import { Building2, Menu, X } from "lucide-react";

type MenuLink = {
  link: string
  titulo: string,
  icon?: React.ReactNode
}

type MenuWebProps = {
  menuLinks: MenuLink[]
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}
export default function MenuWeb({ menuLinks, mobileMenuOpen, setMobileMenuOpen } : MenuWebProps) {
  return (
    <nav className="px-6 py-4 flex items-center justify-between w-full mx-auto gap-6 fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 shadow z-50" role="navigation">
      {/* Logo fixa no canto esquerdo */}
      <div className="flex-shrink-0 flex items-center gap-2 text-xl font-bold text-yellow-500">
        <Building2 className="h-6 w-6" aria-hidden="true" />
        <span>Severino Remodelações</span>
      </div>

      {/* Links desktop */}
      <div className="hidden md:flex gap-6 font-medium">
        {menuLinks.map((item, i) => (
          <LinksMenu
            key={i}
            icon={item.icon}
            link={item.link}
            titulo={item.titulo}
            iconPosition="right"
            aparelho="web"
          />
        ))}
      </div>

      {/* Botão menu mobile */}
      <div className="md:hidden ml-auto">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu de navegação"
          aria-expanded={mobileMenuOpen}
          className="flex items-center gap-2 border-l border-slate-300 dark:border-slate-600 pl-4"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className="text-sm font-medium">Menu</span>
        </button>
      </div>
    </nav>


  )
}



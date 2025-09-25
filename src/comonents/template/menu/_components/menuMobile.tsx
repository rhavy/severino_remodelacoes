import { motion, AnimatePresence } from "framer-motion";
import LinksMenu from "./linksMenu";
import { Building2, Cpu, Eye, Home, ListChecks } from "lucide-react";

type MenuLink = {
  link: string
  titulo: string,
  icon?: React.ReactNode
}

type MenuMobileProps = {
  menuLinks: MenuLink[]
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export default function MenuMobile({
  menuLinks,
  mobileMenuOpen,
  setMobileMenuOpen,
}: MenuMobileProps) {
  if (!mobileMenuOpen) return null

  return (
    <>
    {/* Logo sempre fixa */}
<div className="flex-shrink-0 flex items-center gap-2 text-xl font-bold text-yellow-500">
  <Building2 className="h-6 w-6" aria-hidden="true" />
  <span>Severino Remodelações</span>
</div>

{/* Menu mobile animado */}
<AnimatePresence>
  {mobileMenuOpen && (
    <motion.nav
      key="mobileMenu"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:hidden absolute top-full left-0 w-full px-6 py-4 space-y-4 bg-white dark:bg-slate-900 shadow-md z-40"
    >
      {menuLinks.map((item, i) => (
        <LinksMenu
          key={i}
          icon={item.icon}
          link={item.link}
          titulo={item.titulo}
          iconPosition="right"
          aparelho="mobile"
        />
      ))}
    </motion.nav>
  )}
</AnimatePresence>

    </>
  )
}

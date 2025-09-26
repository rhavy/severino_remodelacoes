import { motion, AnimatePresence } from "framer-motion";
import LinksMenu from "./linksMenu";
import { Building2 } from "lucide-react";

type MenuLink = {
  link: string;
  titulo: string;
  icon?: React.ReactNode;
};

type MenuMobileProps = {
  menuLinks: MenuLink[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  children?: React.ReactNode;
};

export default function MenuMobile({
  menuLinks,
  mobileMenuOpen,
  setMobileMenuOpen,
  children,
}: MenuMobileProps) {
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.nav
          key="mobileMenu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden absolute top-16 left-0 w-full px-6 py-6 space-y-4 bg-gray-50 dark:bg-slate-900 shadow-lg z-50"
        >
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 text-xl font-bold text-yellow-500 mb-4">
            <Building2 className="h-6 w-6" aria-hidden="true" />
            <span>Severino Remodelações</span>
          </div>

          {/* Links */}
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
          {children}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

"use client"

import { useState } from "react";
import MenuWeb from "./_components/menuWeb";
import MenuMobile from "./_components/menuMobile";

type MenuLink = {
  link: string
  titulo: string,
  icon?: React.ReactNode
}

type MenuProps = {
  menuLinks: MenuLink[],
  children?: React.ReactNode
}

export function Menu({ menuLinks, children }: MenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div>
      <MenuWeb
        menuLinks={menuLinks}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        children={children}
      />
      <MenuMobile
        menuLinks={menuLinks}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        children={children}
      />
    </div>
  )
}

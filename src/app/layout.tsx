import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Severino Remodelações | Reformas e Construções de Raiz em Portugal",
  description: "Especialistas em reformas completas, remodelações de interiores e construção civil de alta qualidade em Portugal. Peça já o seu orçamento.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}


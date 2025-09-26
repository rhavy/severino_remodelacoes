import Link from "next/link"
import { SignupForm } from "./_components/signup-form"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Menu } from "@/components/template/menu/page";
import { Hammer, Home, Paintbrush, Quote } from "lucide-react";
import { Footer } from "@/components/template/footer/page";

export default async function Signup() {
  const session = await auth.api.getSession({
      headers: await headers()
  })
  
  if (session) {
      redirect("/dashboard");
    }
  return (
    <main className="flex flex-col flex-1">
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
                { link: "/servicos", titulo: `Serviços`, icon: <Paintbrush size={18} /> },
                { link: "/contato", titulo: "Contato", icon: <Quote size={18} /> },
              ]}
            />
          </nav>
        </div>
      </header>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Cadastro</h1>
            <p className="mt-2 text-sm text-muted-foreground">Crie sua conta para começar</p>
          </div>

          <SignupForm />

          <div className="text-center text-sm">
            <p>
              Já tem uma conta?{" "}
              <Link href="/loginAdmin" className="font-medium text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />       
    </main>
  )
}

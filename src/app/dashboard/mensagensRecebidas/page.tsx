
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MensagensRecebidasContent from "./_components/MensagensRecebidasContent";

export default async function MensagensRecebidas() {
  const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session || !session?.user.emailVerified === true) {
        redirect("/");
      }

  return <MensagensRecebidasContent userId={session.user.id} username={session.user.name} />;
}

// Se você quiser, posso criar uma versão com integração real de backend, onde as mensagens vêm de um banco de dados MySQL ou API, mantendo infinite scroll, filtros e status dinâmicos, pronta para produção.

// Quer que eu faça essa versão com backend integrado?
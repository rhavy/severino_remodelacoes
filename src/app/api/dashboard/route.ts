import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const totalMensagens = await prisma.mensagem.count();
    const mensagensNaoLidas = await prisma.mensagem.count({
      where: { status: "Não Lida" },
    });
    const mensagensApagadas = await prisma.mensagem.count({
      where: { oculta: true },
    });
    const mensagensLidas = await prisma.mensagem.count({
      where: { status: { in: ["Lida", "Resolvida"] } },
    });
    const mensagensResolvidas = await prisma.mensagem.count({
        where: { status: "Resolvida" },
      });
    const mensagensPendentes = await prisma.mensagem.count({
        where: { status: "Pendente" },
        });

    const totalImagens = await prisma.galeria.count();
    const imagensOcultas = await prisma.galeria.count({
      where: { oculta: true },
    });

    const logsMensagens = await prisma.logMensagem.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const logsGaleria = await prisma.logGaleria.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const atividades = [...logsMensagens, ...logsGaleria]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalMensagens,
        mensagensNaoLidas,
        mensagensApagadas,
        mensagensLidas,
        mensagensResolvidas,
        mensagensPendentes,
        totalImagens,
        imagensOcultas,
      },
      atividades,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar dados do dashboard" },
      { status: 500 }
    );
  }
}
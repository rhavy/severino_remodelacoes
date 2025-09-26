// app/api/mensagens/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: criar nova mensagem anônima
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, endereco, titulo, descricao, conteudo } = body;

    if (!nome || !email || !titulo || !descricao || !conteudo) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos." }, { status: 400 });
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        nome,
        email,
        telefone,
        endereco,
        titulo,
        descricao,
        conteudo,
        status: "Não Lida",
        oculta: false,
      },
    });

    return NextResponse.json(novaMensagem);
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    return NextResponse.json({ error: "Erro interno ao salvar mensagem.", details: String(err) }, { status: 500 });
  }
}

// GET: listar mensagens (filtro opcional: status, search, mês)
export async function GET(request: Request) {
  try {
    const { search, status, mes } = Object.fromEntries(new URL(request.url).searchParams.entries());

    // se status === "Ocultas", não filtramos oculta: false
    let where: any = {};
    if (status !== "Ocultas") {
      where.oculta = false;
    }

    if (status && status !== "Todos" && status !== "Ocultas") {
      where.status = status;
    }

    if (search) {
      const query = search.toLowerCase();
      where.OR = [
        { nome: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { telefone: { contains: query, mode: "insensitive" } },
        { endereco: { contains: query, mode: "insensitive" } },
        { titulo: { contains: query, mode: "insensitive" } },
        { descricao: { contains: query, mode: "insensitive" } },
      ];
    }

    if (mes) {
      const dataInicio = new Date(`${mes}-01`);
      const dataFim = new Date(dataInicio);
      dataFim.setMonth(dataFim.getMonth() + 1);
      where.createdAt = { gte: dataInicio, lt: dataFim };
    }

    const mensagens = await prisma.mensagem.findMany({
      where,
      orderBy: { createdAt: "asc" }, // mais antigas primeiro
    });

    return NextResponse.json(mensagens);
  } catch (err) {
    console.error("Erro ao listar mensagens:", err);
    return NextResponse.json({ error: "Erro interno ao buscar mensagens.", details: String(err) }, { status: 500 });
  }
}


// PUT: atualizar status ou conteúdo da mensagem
export async function PUT(req: Request) {
  try {
    const { mensagemId, userId, status } = await req.json();

    if (!mensagemId || !userId || !status) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const mensagem = await prisma.mensagem.findUnique({ where: { id: mensagemId } });
    if (!mensagem) return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 404 });

    // Atualiza status
    const updated = await prisma.mensagem.update({
      where: { id: mensagemId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar mensagem:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PATCH: alternar oculto/exibir mensagem
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { mensagemId, userId, oculta } = body; // agora recebe oculta opcional para toggle

    if (!mensagemId || !userId) {
      return NextResponse.json(
        { error: "mensagemId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const mensagem = await prisma.mensagem.findUnique({ where: { id: mensagemId } });
    if (!mensagem) {
      return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 404 });
    }

    // Se não receber explicitamente o novo valor, alterna o existente
    const novoValor = typeof oculta === "boolean" ? oculta : !mensagem.oculta;

    const updated = await prisma.mensagem.update({
      where: { id: mensagemId },
      data: { oculta: novoValor },
    });

    await prisma.logMensagem.create({
      data: {
        mensagemId,
        userId,
        acao: novoValor ? "ocultou mensagem" : "exibiu mensagem",
        valorAnterior: JSON.stringify(mensagem.oculta),
        valorNovo: JSON.stringify(novoValor),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erro ao alterar visibilidade da mensagem:", err);
    return NextResponse.json(
      { error: "Erro ao alterar visibilidade da mensagem", details: String(err) },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// Helpers
function getExtension(file: File) {
  return file.type.split("/")[1];
}
function isValidImage(file: File) {
  return ["image/png", "image/jpeg"].includes(file.type) && file.size <= 5 * 1024 * 1024;
}

// GET → Listar imagens visíveis
export async function GET() {
  const imagens = await prisma.galeria.findMany({
    where: {  },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(imagens);
}

// POST → Criar nova imagem
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const categoria = formData.get("categoria") as string;

  if (!file || !categoria) return NextResponse.json({ error: "Arquivo e categoria são obrigatórios" }, { status: 400 });
  if (!isValidImage(file)) return NextResponse.json({ error: "Arquivo inválido ou muito grande" }, { status: 400 });

  const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id);
  await mkdir(uploadDir, { recursive: true });

  const ext = getExtension(file);
  const fileName = `galeria-${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, fileName);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));
  const url = `/uploads/${session.user.id}/${fileName}`;

  const galeria = await prisma.galeria.create({
    data: {
      url,
      categoria,
    },
  });

  await prisma.logGaleria.create({
    data: {
      galeriaId: galeria.id,
      userId: session.user.id,
      acao: "adicionou imagem",
      valorNovo: `${categoria} | ${url}`,
    },
  });

  return NextResponse.json(galeria, { status: 201 });
}

// PATCH → Atualizar categoria ou imagem
export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const formData = await req.formData();
  const idValue = formData.get("id");
  const imageId = idValue ? String(idValue) : null;

  if (!imageId) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const newFile = formData.get("file") as File | null;
  const newCategoria = formData.get("categoria") as string | null;

  if (!imageId) return NextResponse.json({ error: "ID da imagem é obrigatório" }, { status: 400 });

  const existing = await prisma.galeria.findUnique({ where: { id: imageId } });
  if (!existing) return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });

  let newUrl = existing.url;

  // Substituir arquivo
  if (newFile && isValidImage(newFile)) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id);
    await mkdir(uploadDir, { recursive: true });

    const ext = getExtension(newFile);
    const fileName = `galeria-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const bytes = await newFile.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    newUrl = `/uploads/${session.user.id}/${fileName}`;

    // Remover arquivo antigo
    if (existing.url.startsWith("/uploads/")) {
      try { await unlink(path.join(process.cwd(), "public", existing.url)); } catch {}
    }
  }

  const updated = await prisma.galeria.update({
    where: { id: imageId },
    data: {
      url: newUrl,
      categoria: newCategoria ?? existing.categoria,
      logs: {
        create: {
          userId: session.user.id,
          acao: "editou imagem",
          valorAnterior: `${existing.categoria} | ${existing.url}`,
          valorNovo: `${newCategoria ?? existing.categoria} | ${newUrl}`,
        },
      },
    },
  });

  return NextResponse.json(updated);
}

// DELETE → Soft delete
export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) 
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const imageId = String(body.id);
  const isDelete = body.delete === true; // flag enviada do frontend

  if (!imageId) 
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const existing = await prisma.galeria.findUnique({ where: { id: imageId } });
  if (!existing) 
    return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });

  const updated = await prisma.galeria.update({
    where: { id: imageId },
    data: {
      oculta: isDelete, // true = ocultar, false = restaurar
      logs: {
        create: {
          userId: session.user.id,
          acao: isDelete ? "ocultou imagem" : "restaurou imagem",
          valorAnterior: `${existing.categoria} | ${existing.url}`,
        },
      },
    },
  });

  return NextResponse.json(updated);
}
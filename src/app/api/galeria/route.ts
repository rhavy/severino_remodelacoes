import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { writeFile, mkdir, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/png", "image/jpeg"]);

const defaultGalleryProjects = [
  {
    id: "default-gallery-residential",
    title: "Remodelação residencial",
    category: "Residencial",
    location: "Portugal",
    image: "/image/projeto-residencial.jpeg",
    description:
      "Exemplo ilustrativo de um projeto residencial, com foco na renovação e valorização dos espaços da casa.",
  },
  {
    id: "default-gallery-commercial",
    title: "Espaço comercial",
    category: "Comercial",
    location: "Portugal",
    image: "/image/projeto-comercial.jpeg",
    description:
      "Exemplo ilustrativo de intervenção num espaço comercial, pensado para conjugar funcionalidade e apresentação.",
  },
  {
    id: "default-gallery-industrial",
    title: "Instalação industrial",
    category: "Industrial",
    location: "Portugal",
    image: "/image/projeto-industrial.jpeg",
    description:
      "Exemplo ilustrativo de uma instalação industrial, com atenção à organização e às necessidades de utilização do espaço.",
  },
  {
    id: "default-gallery-construction",
    title: "Acompanhamento de obra",
    category: "Construções",
    location: "Portugal",
    image: "/image/obra.jpeg",
    description:
      "Exemplo ilustrativo do acompanhamento de uma obra e da coordenação das diferentes etapas de execução.",
  },
];

async function seedDefaultGalleryWhenEmpty() {
  const projectCount = await prisma.galeria.count();
  if (projectCount > 0) return;

  await prisma.galeria.createMany({
    data: defaultGalleryProjects.map((project) => ({
      ...project,
      url: project.image,
      categoria: project.category,
    })),
    skipDuplicates: true,
  });
}

function isValidImage(file: File) {
  return allowedImageTypes.has(file.type) && file.size > 0 && file.size <= MAX_IMAGE_SIZE;
}

function getImageExtension(file: File) {
  return file.type === "image/png" ? "png" : "jpg";
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getImageFile(formData: FormData) {
  const value = formData.get("file");
  return value instanceof File && value.size > 0 ? value : null;
}

function validateProjectFields(fields: {
  title: string;
  category: string;
  location: string;
  description: string;
}) {
  if (!fields.title || !fields.category || !fields.location || !fields.description) {
    return "Preencha título, categoria, localização e descrição.";
  }
  if (fields.title.length > 191 || fields.category.length > 191) {
    return "O título e a categoria devem ter no máximo 191 caracteres.";
  }
  if (fields.location.length > 500 || fields.description.length > 5000) {
    return "A localização deve ter até 500 caracteres e a descrição até 5000.";
  }
  return null;
}

async function saveUploadedImage(file: File, userId: string) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", userId);
  await mkdir(uploadDir, { recursive: true });

  const fileName = `galeria-${Date.now()}-${randomUUID()}.${getImageExtension(file)}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return {
    filePath,
    image: `/uploads/${userId}/${fileName}`,
  };
}

// Público recebe apenas imagens publicadas; a vista completa exige sessão.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeHidden = url.searchParams.get("admin") === "1";
  const includeDeleted = url.searchParams.get("includeDeleted") === "1";

  if (includeHidden) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
  } else {
    await seedDefaultGalleryWhenEmpty();
  }

  const images = includeHidden
    ? await prisma.galeria.findMany({
        where: includeDeleted ? undefined : { excluido: false },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      })
    : await prisma.galeria.findMany({
        where: { oculta: false, excluido: false },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          category: true,
          location: true,
          image: true,
          description: true,
          url: true,
          categoria: true,
          oculta: true,
          excluido: true,
          createdAt: true,
          updatedAt: true,
        },
      });

  return NextResponse.json(images);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = getImageFile(formData);
  const fields = {
    title: getFormString(formData, "title"),
    category: getFormString(formData, "category"),
    location: getFormString(formData, "location"),
    description: getFormString(formData, "description"),
  };
  const validationError = validateProjectFields(fields);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  if (!file || !isValidImage(file)) {
    return NextResponse.json(
      { error: "Selecione uma imagem PNG ou JPEG de até 5 MB." },
      { status: 400 }
    );
  }

  const savedImage = await saveUploadedImage(file, session.user.id);

  try {
    const galleryItem = await prisma.galeria.create({
      data: {
        ...fields,
        image: savedImage.image,
        url: savedImage.image,
        categoria: fields.category,
        userId: session.user.id,
        excluido: false,
        oculta: false,
        logs: {
          create: {
            userId: session.user.id,
            acao: "adicionou projeto à galeria",
            valorNovo: `${fields.title} | ${fields.category} | ${savedImage.image}`,
          },
        },
      },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    await unlink(savedImage.filePath).catch((cleanupError) => {
      console.error("Não foi possível remover o arquivo de imagem temporário:", cleanupError);
    });
    console.error("Erro ao gravar projeto na galeria:", error);
    return NextResponse.json({ error: "Não foi possível guardar o projeto." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const formData = await req.formData();
  const imageId = getFormString(formData, "id");
  if (!imageId) {
    return NextResponse.json({ error: "ID da imagem é obrigatório." }, { status: 400 });
  }

  const existing = await prisma.galeria.findUnique({ where: { id: imageId } });
  if (!existing) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  const fields = {
    title: getFormString(formData, "title"),
    category: getFormString(formData, "category"),
    location: getFormString(formData, "location"),
    description: getFormString(formData, "description"),
  };
  const validationError = validateProjectFields(fields);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const fileValue = formData.get("file");
  const newFile = fileValue instanceof File && fileValue.size > 0 ? fileValue : null;
  if (newFile && !isValidImage(newFile)) {
    return NextResponse.json(
      { error: "Selecione uma imagem PNG ou JPEG de até 5 MB." },
      { status: 400 }
    );
  }

  const uploadedImage = newFile ? await saveUploadedImage(newFile, session.user.id) : null;
  const image = uploadedImage?.image ?? existing.image;

  const updateResult = await prisma.galeria.update({
      where: { id: imageId },
      data: {
        ...fields,
        image,
        url: image,
        categoria: fields.category,
        logs: {
          create: {
            userId: session.user.id,
            acao: "editou projeto da galeria",
            valorAnterior: `${existing.title} | ${existing.category} | ${existing.image}`,
            valorNovo: `${fields.title} | ${fields.category} | ${image}`,
          },
        },
      },
      include: { user: { select: { name: true } } },
    }).then(
      (updated) => ({ updated }),
      (error: unknown) => ({ error })
    );

  if ("error" in updateResult) {
    if (uploadedImage) {
      await unlink(uploadedImage.filePath).catch((cleanupError) => {
        console.error("Não foi possível remover o novo arquivo após falha na atualização:", cleanupError);
      });
    }
    console.error("Erro ao atualizar projeto da galeria:", updateResult.error);
    return NextResponse.json({ error: "Não foi possível atualizar o projeto." }, { status: 500 });
  }

  const updated = updateResult.updated;

  if (uploadedImage && existing.image.startsWith("/uploads/")) {
    const oldFilePath = path.join(process.cwd(), "public", existing.image);
    await unlink(oldFilePath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") {
        console.error("Não foi possível remover a imagem substituída:", error);
      }
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: { id?: unknown; delete?: unknown; excluido?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const imageId = typeof body.id === "string" ? body.id : "";
  if (!imageId) {
    return NextResponse.json({ error: "ID da imagem é obrigatório." }, { status: 400 });
  }

  const existing = await prisma.galeria.findUnique({ where: { id: imageId } });
  if (!existing) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  if (typeof body.excluido === "boolean") {
    const updated = await prisma.galeria.update({
      where: { id: imageId },
      data: {
        excluido: body.excluido,
        logs: {
          create: {
            userId: session.user.id,
            acao: body.excluido ? "excluiu projeto" : "restaurou projeto",
            valorAnterior: `${existing.title} | ${existing.category} | ${existing.image}`,
          },
        },
      },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json(updated);
  }

  const isHidden = body.delete === true;
  const updated = await prisma.galeria.update({
    where: { id: imageId },
    data: {
      oculta: isHidden,
      logs: {
        create: {
          userId: session.user.id,
          acao: isHidden ? "ocultou projeto da galeria" : "restaurou projeto da galeria",
          valorAnterior: `${existing.title} | ${existing.category} | ${existing.image}`,
        },
      },
    },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(updated);
}

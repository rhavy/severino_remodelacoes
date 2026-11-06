"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createProjectAction(data: { url: string; categoria: string }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "É necessário iniciar sessão para criar um projeto." };
    }

    if (!data.url || !data.categoria) {
      return { success: false, error: "URL da imagem e categoria são obrigatórios." };
    }

    const project = await prisma.galeria.create({
      data: {
        title: data.categoria,
        category: data.categoria,
        location: "",
        image: data.url,
        description: "",
        userId: session.user.id,
        url: data.url,
        categoria: data.categoria,
        oculta: false,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true, project };
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return { success: false, error: "Falha ao gravar projeto na base de dados." };
  }
}

export async function toggleProjectVisibilityAction(id: string, oculta: boolean) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "É necessário iniciar sessão para atualizar um projeto." };
    }

    const project = await prisma.galeria.findUnique({ where: { id }, select: { excluido: true } });
    if (!project || project.excluido) {
      return { success: false, error: "Projeto não encontrado ou excluído." };
    }

    await prisma.galeria.update({
      where: { id },
      data: { oculta: !oculta },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar visibilidade do projeto:", error);
    return { success: false, error: "Falha ao atualizar visibilidade." };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "É necessário iniciar sessão para excluir um projeto." };
    }

    await prisma.galeria.update({
      where: { id },
      data: { excluido: true },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao marcar projeto como excluído:", error);
    return { success: false, error: "Falha ao eliminar projeto." };
  }
}

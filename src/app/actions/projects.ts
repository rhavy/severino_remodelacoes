"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: { url: string; categoria: string }) {
  try {
    if (!data.url || !data.categoria) {
      return { success: false, error: "URL da imagem e categoria são obrigatórios." };
    }

    const project = await prisma.galeria.create({
      data: {
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
    await prisma.galeria.update({
      where: { id },
      data: { oculta: !oculta },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao atualizar visibilidade." };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await prisma.galeria.delete({
      where: { id },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Falha ao eliminar projeto." };
  }
}

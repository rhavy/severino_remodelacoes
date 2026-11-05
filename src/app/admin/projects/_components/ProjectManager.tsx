"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  FolderPlus,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import {
  createProjectAction,
  toggleProjectVisibilityAction,
  deleteProjectAction,
} from "@/app/actions/projects";

interface ProjectItem {
  id: string;
  url: string;
  categoria: string;
  oculta: boolean;
  createdAt: Date;
}

export function ProjectManager({
  initialProjects,
}: {
  initialProjects: ProjectItem[];
}) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [url, setUrl] = useState("");
  const [categoria, setCategoria] = useState("Reformas Gerais");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Reformas Gerais",
    "Construção de Raiz",
    "Remodelação de Interiores",
    "Reabilitação de Fachadas",
    "Pinturas & Acabamentos",
    "Impermeabilizações",
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Insira o URL ou caminho relativo da foto da obra.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createProjectAction({ url, categoria });
      if (res.success && res.project) {
        toast.success("Projeto adicionado com sucesso!");
        setProjects([res.project, ...projects]);
        setUrl("");
      } else {
        toast.error(res.error || "Erro ao adicionar projeto.");
      }
    } catch {
      toast.error("Ocorreu um erro ao registar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentOculta: boolean) => {
    try {
      const res = await toggleProjectVisibilityAction(id, currentOculta);
      if (res.success) {
        setProjects(
          projects.map((p) => (p.id === id ? { ...p, oculta: !currentOculta } : p))
        );
        toast.success(
          currentOculta ? "Projeto agora visível no site." : "Projeto ocultado do site."
        );
      }
    } catch {
      toast.error("Falha ao alterar estado do projeto.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar permanentemente este projeto?")) return;
    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        setProjects(projects.filter((p) => p.id !== id));
        toast.success("Projeto removido com sucesso.");
      }
    } catch {
      toast.error("Falha ao eliminar projeto.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Formulário de Criação (CRUD - Create) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 2xl:p-8">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white sm:text-lg">
          <FolderPlus className="w-5 h-5 text-amber-500" />
          Registar Novo Projeto no Portfólio
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              URL da Imagem / Caminho Relativo
            </label>
            <input
              type="text"
              placeholder="Ex: /image/obra.jpeg ou https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:px-4"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Categoria da Obra
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer sm:px-4"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-amber-400 disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A Registar...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Adicionar ao Portfólio
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Listagem / Cards (CRUD - Read, Update, Delete) */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">
          Obras Cadastradas ({projects.length})
        </h3>

        {projects.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500">
            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-500" />
            <p className="text-sm font-semibold text-zinc-400">Nenhum projeto registado no portfólio.</p>
            <p className="text-xs text-zinc-500 mt-1">Utilize o formulário acima para adicionar novas fotos e categorias de obras.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-zinc-950">
                  <Image
                    src={proj.url.startsWith("/") || proj.url.startsWith("http") ? proj.url : "/image/obra.jpeg"}
                    alt={proj.categoria}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="max-w-[80%] truncate rounded bg-zinc-950/80 px-2.5 py-1 text-[11px] font-bold uppercase text-amber-400 backdrop-blur-md">
                      {proj.categoria}
                    </span>
                  </div>
                  {proj.oculta && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-500/80 text-white text-[10px] font-bold uppercase">
                      Oculto
                    </div>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between border-t border-zinc-800">
                  <button
                    onClick={() => handleToggle(proj.id, proj.oculta)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors"
                  >
                    {proj.oculta ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-amber-400" /> Publicar
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-zinc-400" /> Ocultar
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Eliminar projeto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Check,
  Eye,
  EyeOff,
  FolderPlus,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

type ProjectItem = {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
  url: string;
  categoria: string;
  oculta: boolean;
  excluido: boolean;
  createdAt: string | Date;
  user: { name: string } | null;
};

const categories = [
  "Residencial",
  "Comercial",
  "Industrial",
  "Reformas",
  "Construções",
  "Acabamentos",
  "Manutenção Predial",
  "Reformas Gerais",
  "Construção de Raiz",
  "Remodelação de Interiores",
  "Reabilitação de Fachadas",
  "Pinturas & Acabamentos",
  "Impermeabilizações",
];

const inputClassName =
  "w-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:px-4";

export function ProjectManager({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("Todos");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCategory(categories[0]);
    setLocation("");
    setDescription("");
    setFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("category", category);
    formData.set("location", location.trim());
    formData.set("description", description.trim());
    if (file) formData.set("file", file);
    if (editingId) formData.set("id", editingId);

    try {
      const response = await fetch("/api/galeria", {
        method: editingId ? "PATCH" : "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível guardar o projeto.");

      const savedProject = result as ProjectItem;
      setProjects((current) =>
        editingId
          ? current.map((project) => project.id === savedProject.id ? savedProject : project)
          : [savedProject, ...current]
      );
      toast.success(editingId ? "Projeto atualizado com sucesso." : "Projeto adicionado com sucesso.");
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao guardar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: ProjectItem) => {
    setEditingId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setLocation(project.location);
    setDescription(project.description);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVisibility = async (project: ProjectItem) => {
    try {
      const response = await fetch("/api/galeria", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, delete: !project.oculta }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível alterar a visibilidade.");
      setProjects((current) => current.map((item) => item.id === project.id ? result : item));
      toast.success(project.oculta ? "Projeto publicado." : "Projeto ocultado do site.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao alterar a visibilidade.");
    }
  };

  const handleSoftDelete = async (project: ProjectItem, excluded: boolean) => {
    const prompt = excluded
      ? "Restaurar este projeto e voltar a disponibilizá-lo no painel?"
      : "Mover este projeto para Excluídos? Ele deixará de aparecer no site público.";
    if (!window.confirm(prompt)) return;

    try {
      const response = await fetch("/api/galeria", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, excluido: !excluded }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível atualizar o projeto.");
      setProjects((current) => current.map((item) => item.id === project.id ? result : item));
      toast.success(excluded ? "Projeto restaurado." : "Projeto movido para Excluídos.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar o projeto.");
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "Excluídos") return project.excluido;
    if (filter === "Ocultos") return project.oculta && !project.excluido;
    if (filter === "Publicados") return !project.oculta && !project.excluido;
    return true;
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 2xl:p-8">
        <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-white sm:text-lg">
          <FolderPlus className="h-5 w-5 text-amber-500" />
          {editingId ? "Editar projeto do Portfólio" : "Registar Novo Projeto no Portfólio"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Título
            <input
              required
              maxLength={191}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Remodelação de apartamento"
              className={inputClassName}
            />
          </label>

          <label className="space-y-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Categoria
            <select
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClassName}
            >
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Localização
            <input
              required
              maxLength={500}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Ex.: Lisboa, Portugal"
              className={inputClassName}
            />
          </label>

          <label className="space-y-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Imagem {editingId ? "(opcional para manter a atual)" : ""}
            <input
              required={!editingId}
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className={`${inputClassName} file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:font-semibold file:text-zinc-950`}
            />
            <span className="block font-normal normal-case tracking-normal text-zinc-500">
              PNG ou JPEG, até 5 MB.
            </span>
          </label>

          <label className="space-y-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 sm:col-span-2">
            Descrição
            <textarea
              required
              maxLength={5000}
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descreva os principais detalhes do projeto."
              className={inputClassName}
            />
          </label>

          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                <X className="h-4 w-4" /> Cancelar edição
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all hover:bg-amber-400 disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {isSubmitting
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? "A guardar..." : editingId ? "Guardar alterações" : "Adicionar ao Portfólio"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-white">
            Obras Cadastradas ({filteredProjects.length})
          </h2>
          <select
            aria-label="Filtrar projetos por estado"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white sm:w-auto"
          >
            {["Todos", "Publicados", "Ocultos", "Excluídos"].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-500 sm:p-12">
            <ImageIcon className="mx-auto mb-2 h-10 w-10 text-amber-500 opacity-30" />
            <p className="text-sm font-semibold text-zinc-400">Nenhum projeto nesta lista.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-zinc-900 shadow-lg ${
                  project.excluido ? "border-red-500/30 opacity-80" : "border-zinc-800"
                }`}
              >
                <div className="relative h-48 w-full bg-zinc-950">
                  <Image
                    src={project.image || project.url || "/image/obra.jpeg"}
                    alt={project.title || project.category}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 max-w-[80%] truncate rounded bg-zinc-950/85 px-2.5 py-1 text-[11px] font-bold uppercase text-amber-400 backdrop-blur-md">
                    {project.category || project.categoria}
                  </span>
                  {project.excluido ? (
                    <span className="absolute right-3 top-3 rounded bg-red-600/90 px-2 py-1 text-[10px] font-bold uppercase text-white">
                      Excluído
                    </span>
                  ) : project.oculta ? (
                    <span className="absolute right-3 top-3 rounded bg-zinc-800/90 px-2 py-1 text-[10px] font-bold uppercase text-zinc-200">
                      Oculto
                    </span>
                  ) : null}
                </div>

                <div className="flex-1 space-y-2 p-4">
                  <h3 className="font-semibold text-white">{project.title || project.categoria}</h3>
                  <p className="text-xs font-medium text-amber-400">{project.location || "Localização não informada"}</p>
                  <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                    {project.description || "Sem descrição."}
                  </p>
                  <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-400">
                    <p>
                      Criado por: <span className="font-medium text-zinc-200">{project.user?.name || "Utilizador não identificado"}</span>
                    </p>
                    <p className="mt-1">
                      Data: <time dateTime={new Date(project.createdAt).toISOString()}>
                        {new Date(project.createdAt).toLocaleString("pt-PT", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 p-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    disabled={project.excluido}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>

                  {!project.excluido && (
                    <button
                      type="button"
                      onClick={() => handleVisibility(project)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                    >
                      {project.oculta
                        ? <><Eye className="h-3.5 w-3.5 text-amber-400" /> Publicar</>
                        : <><EyeOff className="h-3.5 w-3.5 text-zinc-400" /> Ocultar</>}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSoftDelete(project, project.excluido)}
                    className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                      project.excluido
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    }`}
                  >
                    {project.excluido
                      ? <><RotateCcw className="h-3.5 w-3.5" /> Restaurar</>
                      : <><Trash2 className="h-3.5 w-3.5" /> Excluir</>}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

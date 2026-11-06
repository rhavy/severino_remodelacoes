"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Eye,
  EyeOff,
  FolderPlus,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

type ItemGaleria = {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
  userId: string | null;
  url: string;
  categoria: string;
  oculta: boolean;
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
  "w-full min-w-0 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

export default function GalleryContent() {
  const [gallery, setGallery] = useState<ItemGaleria[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGallery() {
      try {
        const response = await fetch("/api/galeria?admin=1", { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Não foi possível carregar os projetos da galeria.");
        }
        setGallery(await response.json());
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Erro ao carregar a galeria.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadGallery();
    return () => controller.abort();
  }, []);

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
    setError(null);
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
      if (!response.ok) {
        throw new Error(result.error || "Não foi possível guardar o projeto.");
      }

      const savedItem = result as ItemGaleria;
      setGallery((current) =>
        editingId
          ? current.map((item) => (item.id === savedItem.id ? savedItem : item))
          : [savedItem, ...current]
      );
      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro ao guardar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: ItemGaleria) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setLocation(item.location);
    setDescription(item.description);
    setFile(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleVisibility = async (item: ItemGaleria) => {
    setError(null);
    try {
      const response = await fetch("/api/galeria", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, delete: !item.oculta }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível alterar a visibilidade.");
      setGallery((current) => current.map((entry) => entry.id === item.id ? result : entry));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Erro ao alterar a visibilidade.");
    }
  };

  const filteredGallery = gallery.filter((item) => {
    if (filter === "Todos") return !item.oculta;
    if (filter === "Apagado") return item.oculta;
    return item.category === filter;
  });
  const filterOptions = ["Todos", ...new Set(gallery.map((item) => item.category)), "Apagado"];

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-3 sm:space-y-8 sm:p-5 2xl:p-8">
      <div>
        <h1 className="text-2xl font-bold text-yellow-600 sm:text-3xl">Galeria de Projetos</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Registe os detalhes das obras para apresentar no portfólio público.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
          <FolderPlus className="h-5 w-5 text-amber-500" />
          {editingId ? "Editar projeto" : "Adicionar projeto"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-zinc-300">
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

          <label className="space-y-1.5 text-xs font-semibold text-zinc-300">
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

          <label className="space-y-1.5 text-xs font-semibold text-zinc-300">
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

          <label className="space-y-1.5 text-xs font-semibold text-zinc-300">
            Imagem {editingId ? "(opcional para manter a atual)" : ""}
            <input
              required={!editingId}
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className={`${inputClassName} file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:font-semibold file:text-zinc-950`}
            />
            <span className="block font-normal text-zinc-500">PNG ou JPEG, até 5 MB.</span>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-zinc-300 sm:col-span-2">
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                <X className="h-4 w-4" /> Cancelar edição
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? "A guardar..." : editingId ? "Guardar alterações" : "Adicionar projeto"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-white">Projetos registados ({filteredGallery.length})</h2>
          <select
            aria-label="Filtrar projetos por categoria"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white sm:w-auto"
          >
            {filterOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-zinc-400">A carregar projetos...</p>
        ) : filteredGallery.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400 sm:p-12">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-amber-500 opacity-50" />
            <p className="font-semibold">Nenhum projeto nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-6">
            {filteredGallery.map((item, index) => (
              <motion.article
                key={item.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <div className="relative h-52 bg-zinc-950">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <span className="absolute left-3 top-3 max-w-[80%] truncate rounded bg-zinc-950/85 px-2.5 py-1 text-[11px] font-bold uppercase text-amber-400">
                    {item.category}
                  </span>
                  {item.oculta && (
                    <span className="absolute right-3 top-3 rounded bg-red-500/90 px-2 py-1 text-[10px] font-bold uppercase text-white">
                      Oculto
                    </span>
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-xs font-medium text-amber-400">{item.location}</p>
                  <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 p-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                  >
                    {item.oculta
                      ? <><Eye className="h-3.5 w-3.5 text-amber-400" /> Publicar</>
                      : <><EyeOff className="h-3.5 w-3.5 text-zinc-400" /> Ocultar</>}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

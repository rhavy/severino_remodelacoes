"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Check, X, Pencil, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

type Categoria =
  | "Residencial"
  | "Comercial"
  | "Industrial"
  | "Reformas"
  | "Construções"
  | "Acabamentos"
  | "Manutenção Predial";

type ItemGaleria = {
  id: string; // 🔹 Agora string
  url: string;
  categoria: Categoria;
  oculta?: boolean;
};

export default function GalleryContent({ username }: { username: string }) {
  const [gallery, setGallery] = useState<ItemGaleria[]>([]);
  const [filter, setFilter] = useState<Categoria | "Todos" | "Apagado">("Todos");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [tempCategoria, setTempCategoria] = useState<Categoria>("Residencial");
  const [editingId, setEditingId] = useState<string | null>(null);

  const categorias: (Categoria | "Todos" | "Apagado")[] = [
    "Todos",
    "Residencial",
    "Comercial",
    "Industrial",
    "Reformas",
    "Construções",
    "Acabamentos",
    "Manutenção Predial",
    "Apagado",
  ];

  // Buscar galeria ao carregar
  useEffect(() => {
    fetch("/api/galeria")
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error("Erro ao buscar galeria:", err));
  }, []);

  // Selecionar arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setTempCategoria("Residencial");
  };

  // Confirmar upload (POST)
  const handleConfirmUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoria", tempCategoria);

    try {
      const res = await fetch("/api/galeria", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Erro ao salvar imagem");
      const nova: ItemGaleria = await res.json();
      setGallery((prev) => [nova, ...prev]);
      setPreview(null);
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Cancelar upload
  const handleCancelUpload = () => {
    setPreview(null);
    setFile(null);
  };

  // Ocultar / Restaurar
  const handleToggleOculta = async (id: string, isDelete: boolean) => {
    try {
      const res = await fetch(`/api/galeria`, {
        method: "DELETE",
        body: JSON.stringify({ id, delete: isDelete }), // enviar a flag para o backend
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");
      const updated: ItemGaleria = await res.json();

      setGallery((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      console.error(err);
    }
  };


  // Editar categoria existente
  const handleEdit = (id: string, categoria: Categoria) => {
    setEditingId(id);
    setTempCategoria(categoria);
  };

  // Salvar edição (PATCH)
  const handleSaveEdit = async (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("categoria", tempCategoria);
    if (file) formData.append("file", file);

    try {
      const res = await fetch(`/api/galeria`, { method: "PATCH", body: formData });
      if (!res.ok) throw new Error("Erro ao editar imagem");
      const atualizado: ItemGaleria = await res.json();

      setGallery((prev) =>
        prev.map((item) => (item.id === id ? atualizado : item))
      );
      setEditingId(null);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredGallery = gallery.filter((item) => {
    if (filter === "Todos") return !item.oculta;
    if (filter === "Apagado") return item.oculta;
    return item.categoria === filter;
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-yellow-600">📸 Galeria de Projetos</h1>

      {/* Upload + Filtro */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <label className="flex items-center gap-3 px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg cursor-pointer hover:bg-yellow-600 transition">
          <Upload size={18} />
          <span>Selecionar Imagem</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Categoria | "Todos" | "Apagado")}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Modal Preview */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Pré-visualização da Imagem</h2>
            <Image src={preview} alt="Preview" width={400} height={300} className="object-cover rounded-lg w-full" />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
              <select
                value={tempCategoria}
                onChange={(e) => setTempCategoria(e.target.value as Categoria)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              >
                {categorias.filter((cat) => cat !== "Todos" && cat !== "Apagado").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleConfirmUpload}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Check size={18} /> Confirmar
              </button>
              <button
                onClick={handleCancelUpload}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <X size={18} /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGallery.map((item, i) => (
          <motion.div
            key={item.id}
            className="relative rounded-lg overflow-hidden shadow group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Image src={item.url} alt={`Imagem ${item.id}`} width={400} height={300} className="object-cover w-full h-60" />
            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-sm px-3 py-2 flex items-center justify-between">
              {editingId === item.id ? (
                <div className="flex gap-2 items-center">
                  <select
                    value={tempCategoria}
                    onChange={(e) => setTempCategoria(e.target.value as Categoria)}
                    className="text-black rounded px-2 py-1"
                  >
                    {categorias.filter((cat) => cat !== "Todos" && cat !== "Apagado").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button onClick={() => handleSaveEdit(item.id)} className="bg-green-500 text-white px-2 py-1 rounded">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-red-500 text-white px-2 py-1 rounded">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span>{item.categoria}</span>
                  <button onClick={() => handleEdit(item.id, item.categoria)} className="opacity-0 group-hover:opacity-100 transition">
                    <Pencil size={16} />
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handleToggleOculta(item.id, !item.oculta)}
              className={`absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition ${
                item.oculta ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {item.oculta ? <RotateCcw size={16} /> : <Trash2 size={16} />}
            </button>

          </motion.div>
        ))}
      </div>
    </div>
  );
}

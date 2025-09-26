"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Check, EyeOff, Eye } from "lucide-react";
import { DataRecebida } from "./formataDataRecebida";

type StatusMensagem = "Não Lida" | "Lida" | "Resolvida" | "Pendente" | "Outros" | "Ocultas";

type Mensagem = {
  id: string;
  avatar?: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  status: StatusMensagem;
  createdAt: string;
  oculta: boolean;
};

type Props = {
  username: string;
  userId: string; // usuário logado que faz alterações
};

export default function MensagensRecebidasContent({ username, userId }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [selectedMensagem, setSelectedMensagem] = useState<Mensagem | null>(null);
  const [tempStatus, setTempStatus] = useState<StatusMensagem>("Não Lida");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusMensagem | "Todos">("Todos");
  const [monthFilter, setMonthFilter] = useState<string>(""); // formato YYYY-MM
  const [loading, setLoading] = useState(false);

  const statusOptions: (StatusMensagem | "Todos" | "Ocultas")[] = [
    "Todos",
    "Não Lida",
    "Lida",
    "Resolvida",
    "Pendente",
    "Outros",
    "Ocultas", // nova opção
    ];


  // 🔄 Buscar mensagens da API
  const fetchMensagens = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter && statusFilter !== "Todos") params.append("status", statusFilter);
      if (monthFilter) params.append("mes", monthFilter);

      const res = await fetch(`/api/mensagens?${params.toString()}`);
      const data = await res.json();
      setMensagens(data);
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, monthFilter]);

  useEffect(() => {
    fetchMensagens();
  }, [fetchMensagens]);

  // 🔹 Abrir modal
  const handleOpenModal = (mensagem: Mensagem) => {
    setTempStatus(mensagem.status);
    setSelectedMensagem(mensagem);
  };


  // 🔹 Fechar modal
  const handleCloseModal = () => setSelectedMensagem(null);

  // 🔹 Atualizar status via API
    const handleSaveStatus = async () => {
        if (!selectedMensagem?.id || !userId || !tempStatus) return;

        try {
            const res = await fetch(`/api/mensagens`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mensagemId: selectedMensagem.id,
                userId,
                status: tempStatus,
            }),
            });

            if (!res.ok) {
            const errorBody = await res.text();
            console.error("Erro do backend:", res.status, errorBody);
            throw new Error(`Falha ao atualizar status: ${res.status}`);
            }

            const updated = await res.json();
            setMensagens((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
            );
            handleCloseModal();
        } catch (err: any) {
            console.error("Erro ao salvar status:", err);
            alert("Não foi possível atualizar o status. Tente novamente.");
        }
    };


   // 🔹 Alternar oculto/exibir mensagem via API
    const handleToggleOculto = async (mensagem: Mensagem) => {
    try {
        const res = await fetch(`/api/mensagens`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            mensagemId: mensagem.id, 
            userId, 
            oculta: !mensagem.oculta // alterna o valor
        }),
        });

        if (!res.ok) {
        const errorBody = await res.text();
        console.error("Erro do backend:", res.status, errorBody);
        throw new Error("Falha ao alterar visibilidade da mensagem");
        }

        const updated = await res.json();

        // Atualiza a lista e o modal, mantendo os dados corretos
        setMensagens((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
        );

        if (selectedMensagem?.id === mensagem.id) {
        // setSelectedMensagem(updated); // mantém modal aberto com dados atualizados
        handleCloseModal();
        }
    } catch (err: any) {
        console.error("Erro ao alternar oculto:", err);
        alert("Não foi possível alterar a visibilidade da mensagem. Tente novamente.");
    }
    };




  // 🔹 Filtragem adicional (em memória)
   const mensagensFiltradas = useMemo(() => {
    return mensagens
        .filter((m) => {
        if (statusFilter === "Todos") return !m.oculta;      // só não ocultas
        if (statusFilter === "Ocultas") return m.oculta;    // só ocultas
        return m.status === statusFilter && !m.oculta;      // filtra por status e não ocultas
        })
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [mensagens, statusFilter]);



  return (
    <div className="p-6 space-y-6">
      {/* Título e descrição */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-yellow-600">📩 Mensagens Recebidas</h1>
        <p className="text-gray-600">
          Visualize, filtre e busque mensagens por nome, e-mail, telefone ou endereço.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Buscar por nome, e-mail, telefone ou endereço"
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusMensagem | "Todos" | "Ocultas")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            >
            {statusOptions.map((status) => (
                <option key={status} value={status}>
                {status}
                </option>
            ))}
        </select>

        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        />
      </div>

      {/* Grid mensagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : mensagensFiltradas.length === 0 ? (
          <p className="text-gray-500 col-span-full">Nenhuma mensagem encontrada.</p>
        ) : (
          mensagensFiltradas.map((msg) => (
            <motion.div
              key={msg.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-1 cursor-pointer hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleOpenModal(msg)}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={msg.avatar || "/image/AvatarCliente.png"}
                  alt={msg.nome}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                  unoptimized
                />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-gray-800">{msg.nome}</p>
                  <p className="font-medium text-gray-700">{msg.titulo}</p>
                  <p className="text-gray-500 truncate">{msg.descricao}</p>
                  <p className="text-gray-500 truncate">{msg.endereco}</p>
                  <p className="text-gray-500">
                    Recebida em: <DataRecebida data={msg.createdAt} />
                  </p>
                </div>
              </div>
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                  msg.status === "Não Lida"
                    ? "bg-red-100 text-red-700"
                    : msg.status === "Lida"
                    ? "bg-green-100 text-green-700"
                    : msg.status === "Resolvida"
                    ? "bg-blue-100 text-blue-700"
                    : msg.status === "Pendente"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {msg.status}
              </span>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedMensagem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg space-y-4 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedMensagem.avatar || "/image/AvatarCliente.png"}
                  alt={selectedMensagem.nome}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  unoptimized
                />
                <div>
                  <p className="font-semibold text-gray-800">{selectedMensagem.nome}</p>
                  <p className="font-medium text-gray-700">{selectedMensagem.titulo}</p>
                  <p className="text-gray-500">{selectedMensagem.descricao}</p>
                  <p className="text-gray-500">{selectedMensagem.endereco}</p>
                  <p className="text-gray-500">
                    Recebida em: <DataRecebida data={selectedMensagem.createdAt} />
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Conteúdo:</h3>
                <p className="text-gray-600">{selectedMensagem.conteudo}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">E-mail:</span>{" "}
                  <a
                    href={`mailto:${selectedMensagem.email}`}
                    className="text-gray-500 hover:text-gray-700 underline"
                  >
                    {selectedMensagem.email}
                  </a>
                </div>
                <div>
                  <span className="font-medium">Telefone:</span>{" "}
                  <a
                    href={`https://wa.me/${selectedMensagem.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 underline"
                  >
                    {selectedMensagem.telefone}
                  </a>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value as StatusMensagem)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                >
                  {statusOptions.filter((s) => s !== "Todos").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={handleSaveStatus}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <Check size={18} /> Salvar
                </button>

                <button
                    onClick={() => selectedMensagem && handleToggleOculto(selectedMensagem)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                    {selectedMensagem?.oculta ? <Eye size={18} /> : (<EyeOff size={18} />)}
                    {selectedMensagem?.oculta ? "Exibir" : "Ocultar"}
                </button>


                <button
                  onClick={handleCloseModal}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <X size={18} /> Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

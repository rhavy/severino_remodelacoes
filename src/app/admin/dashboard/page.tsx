import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  FileText,
  Clock3,
  User,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Buscar os orçamentos/leads no banco de dados MySQL
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalLeads = leads.length;
  const pendingLeads = leads.filter((l) => l.status === "PENDENTE").length;
  const whatsappLeads = leads.filter((l) => l.isWhatsapp).length;

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard & Gestão de Leads
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Acompanhamento centralizado de pedidos de orçamento e agendamento de vistorias técnicas
          </p>
        </div>

        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto"
        >
          Gerir Projetos (CRUD)
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">Total de Leads</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">{totalLeads}</span>
            <p className="text-xs text-zinc-400 mt-1">Orçamentos solicitados via site</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Pendentes</span>
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
              <Clock3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-400">{pendingLeads}</span>
            <p className="text-xs text-zinc-400 mt-1">Aguardam contacto da equipa comercial</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">WhatsApp Ativo</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-emerald-400">{whatsappLeads}</span>
            <p className="text-xs text-zinc-400 mt-1">Contactáveis diretamente pelo aplicativo</p>
          </div>
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Listagem de Orçamentos Recentes</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Ordenados do mais recente para o mais antigo</p>
        </div>

        {leads.length === 0 ? (
          <div className="p-16 text-center text-zinc-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
            <p className="text-base font-semibold text-zinc-400">Nenhum orçamento submetido ainda.</p>
            <p className="text-xs text-zinc-500 mt-1">Novas propostas enviadas no site surgirão aqui automaticamente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950/70 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6">Cliente & Contacto</th>
                  <th className="py-4 px-6">Tipo de Obra</th>
                  <th className="py-4 px-6">Visita Técnica</th>
                  <th className="py-4 px-6">Preferência</th>
                  <th className="py-4 px-6">Descrição</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Data de Registo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {leads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanPhone}`;

                  return (
                    <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Cliente */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <User className="w-4 h-4 text-amber-500" />
                          {lead.name}
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                          <Mail className="w-3.5 h-3.5 text-zinc-500" />
                          <a href={`mailto:${lead.email}`} className="hover:text-amber-400 transition-colors">
                            {lead.email}
                          </a>
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <a href={`tel:${lead.phone}`} className="hover:text-amber-400 transition-colors">
                            {lead.phone}
                          </a>
                          {lead.isWhatsapp && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20 text-[11px] ml-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Assunto / Tipo */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-300">
                          {lead.subject}
                        </span>
                      </td>

                      {/* Visita */}
                      <td className="py-4 px-6">
                        {lead.preferredDate ? (
                          <div className="text-xs text-zinc-200">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" />
                              {lead.preferredDate}
                            </div>
                            {lead.preferredTime && (
                              <div className="flex items-center gap-1.5 text-zinc-400 mt-0.5">
                                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                {lead.preferredTime}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-500 italic">Não agendada</span>
                        )}
                      </td>

                      {/* Preferência */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {lead.contactPreference}
                        </span>
                      </td>

                      {/* Mensagem */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-xs text-zinc-300 line-clamp-3 whitespace-pre-line" title={lead.message}>
                          {lead.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {lead.status}
                        </span>
                      </td>

                      {/* Data */}
                      <td className="py-4 px-6 text-xs text-zinc-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

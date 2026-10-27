import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  CheckCircle,
  Clock3,
  Search,
  ArrowLeft,
  ShieldCheck,
  FileText,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  // Verificação de autenticação Better-Auth no lado do servidor
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se não estiver logado, redireciona para a página de login
  if (!session?.user) {
    redirect("/login");
  }

  // Buscar todos os leads ordenados pelos mais recentes
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351 912 345 678";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contato@severinoconstrucoes.pt";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Superior com Informações do Administrador */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Painel de Orçamentos & Leads
                </h1>
                <p className="text-sm text-zinc-400">
                  Severino Remodelações &bull; Gestão comercial e solicitações de visitas técnicas
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver Site
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{session.user.name || session.user.email}</span>
            </div>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Total de Orçamentos</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">{leads.length}</span>
              <FileText className="w-6 h-6 text-amber-500/40" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Pendentes</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-amber-400">
                {leads.filter((l) => l.status === "PENDENTE").length}
              </span>
              <Clock3 className="w-6 h-6 text-amber-400/40" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Com WhatsApp</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-400">
                {leads.filter((l) => l.isWhatsapp).length}
              </span>
              <MessageCircle className="w-6 h-6 text-emerald-400/40" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Contacto Oficial Configurado</p>
            <div className="mt-2 text-xs text-zinc-300 truncate">
              <p className="font-semibold text-white">{companyPhone}</p>
              <p className="text-zinc-400 truncate">{companyEmail}</p>
            </div>
          </div>
        </div>

        {/* Tabela de Leads */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Solicitações Recebidas ({leads.length})</h2>
              <p className="text-xs text-zinc-400">Listagem completa ordenada da mais recente para a mais antiga</p>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="p-16 text-center text-zinc-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p className="text-base font-semibold text-zinc-400">Nenhum orçamento recebido ainda.</p>
              <p className="text-xs text-zinc-500 mt-1">Os pedidos enviados no formulário do site aparecerão aqui em tempo real.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/70 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">Cliente / Contacto</th>
                    <th className="py-4 px-6">Tipo de Obra</th>
                    <th className="py-4 px-6">Visita Sugerida</th>
                    <th className="py-4 px-6">Pref. Contacto</th>
                    <th className="py-4 px-6">Descrição do Projeto</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Data de Envio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {leads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                    const whatsappLink = `https://wa.me/${cleanPhone}`;

                    return (
                      <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors">
                        {/* Cliente e Contactos */}
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
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-colors text-[11px]"
                                title="Abrir conversa no WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Tipo de Obra */}
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-300">
                            {lead.subject}
                          </span>
                        </td>

                        {/* Visita Sugerida */}
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

                        {/* Preferência de Contacto */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                              lead.contactPreference === "TELEFONE"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}
                          >
                            {lead.contactPreference}
                          </span>
                        </td>

                        {/* Descrição */}
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
    </div>
  );
}

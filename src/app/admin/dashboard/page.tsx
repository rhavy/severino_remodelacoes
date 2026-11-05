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
} from "lucide-react";

export const dynamic = "force-dynamic";

function getLeadContactLinks(lead: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  preferredDate: string | null;
  preferredTime: string | null;
}) {
  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
  const whatsappPhone = cleanPhone.length === 9
    ? `351${cleanPhone}`
    : cleanPhone.startsWith("00")
      ? cleanPhone.slice(2)
      : cleanPhone;
  const emailSubject = `Pedido de orçamento: ${lead.subject}`;
  const emailBody = [
    `Olá, ${lead.name},`,
    "",
    "Agradecemos o seu contacto e o interesse nos serviços da Severino Remodelações.",
    `Recebemos o seu pedido de orçamento para "${lead.subject}" e vamos analisar os detalhes para lhe apresentar uma resposta adequada.`,
    lead.preferredDate
      ? `Registámos a sua disponibilidade para uma visita em ${lead.preferredDate}${lead.preferredTime ? `, ${lead.preferredTime}` : ""}.`
      : "",
    "",
    "Se tiver fotografias, medidas ou outras informações relevantes, poderá responder a este e-mail.",
    "",
    "Com os melhores cumprimentos,",
    "Equipa Severino Remodelações",
  ].filter(Boolean).join("\n");
  const whatsappMessage = [
    `Olá, ${lead.name}.`,
    "",
    "Agradecemos o seu pedido de orçamento à Severino Remodelações.",
    `Recebemos o seu pedido para "${lead.subject}" e vamos analisar os detalhes para lhe responder o mais brevemente possível.`,
    "Se tiver fotografias ou informações adicionais sobre o projeto, pode enviá-las por aqui.",
    "",
    "Com os melhores cumprimentos,",
    "Equipa Severino Remodelações",
  ].join("\n");

  return {
    emailHref: `mailto:${lead.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
    whatsappHref: `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`,
  };
}

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
    <div className="mx-auto max-w-screen-2xl space-y-6 p-3 sm:space-y-8 sm:p-5 2xl:p-10">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg sm:p-6">
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

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg sm:p-6">
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

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg sm:p-6">
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
        <div className="border-b border-zinc-800 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-white">Listagem de Orçamentos Recentes</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Ordenados do mais recente para o mais antigo</p>
        </div>

        {leads.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 sm:p-16">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
            <p className="text-base font-semibold text-zinc-400">Nenhum orçamento submetido ainda.</p>
            <p className="text-xs text-zinc-500 mt-1">Novas propostas enviadas no site surgirão aqui automaticamente.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:hidden">
              {leads.map((lead) => {
                const { emailHref, whatsappHref } = getLeadContactLinks(lead);
                const createdAt = new Date(lead.createdAt).toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <article
                    key={lead.id}
                    className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-white">{lead.name}</h3>
                        <span className="mt-2 inline-flex max-w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-amber-300">
                          <span className="truncate">{lead.subject}</span>
                        </span>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {lead.status}
                      </span>
                    </div>

                    <div className="space-y-2 border-y border-zinc-800 py-3 text-xs text-zinc-300">
                      <p className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span>
                          {lead.preferredDate
                            ? `${lead.preferredDate}${lead.preferredTime ? ` · ${lead.preferredTime}` : ""}`
                            : "Visita técnica não agendada"}
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span>Contacto preferido: {lead.contactPreference}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
                        <span>Registado em {createdAt}</span>
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        Descrição do projeto
                      </h4>
                      <p className="whitespace-pre-line break-words text-sm leading-relaxed text-zinc-300">
                        {lead.message}
                      </p>
                    </div>

                    <div className="mt-auto space-y-2 border-t border-zinc-800 pt-3">
                      <a
                        href={emailHref}
                        className="flex min-w-0 items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-amber-400"
                        title="Responder por e-mail com mensagem sugerida"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
                        <span className="truncate">{lead.email}</span>
                      </a>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-amber-400"
                          title="Responder pelo WhatsApp com mensagem sugerida"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-zinc-500" />
                          {lead.phone}
                        </a>
                        {lead.isWhatsapp && (
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                          >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-zinc-950/70 text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-4 sm:px-6">Cliente & Contacto</th>
                  <th className="px-4 py-4 sm:px-6">Tipo de Obra</th>
                  <th className="px-4 py-4 sm:px-6">Visita Técnica</th>
                  <th className="px-4 py-4 sm:px-6">Preferência</th>
                  <th className="px-4 py-4 sm:px-6">Descrição</th>
                  <th className="px-4 py-4 sm:px-6">Status</th>
                  <th className="px-4 py-4 sm:px-6">Data de Registo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {leads.map((lead) => {
                  const { emailHref, whatsappHref } = getLeadContactLinks(lead);

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
                          <a
                            href={emailHref}
                            className="hover:text-amber-400 transition-colors"
                            title="Responder por e-mail com mensagem sugerida"
                          >
                            {lead.email}
                          </a>
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-400 transition-colors"
                            title="Responder pelo WhatsApp com mensagem sugerida"
                          >
                            {lead.phone}
                          </a>
                          {lead.isWhatsapp && (
                            <a
                              href={whatsappHref}
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
          </>
        )}
      </div>
    </div>
  );
}

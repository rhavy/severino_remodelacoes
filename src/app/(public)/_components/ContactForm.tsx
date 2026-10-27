"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Send,
  Building2,
  MessageCircle,
} from "lucide-react";
import { submitLeadAction } from "@/app/actions/leads";

const formSchema = z.object({
  name: z.string().min(2, "Por favor, insira o seu nome completo."),
  email: z.string().email("Por favor, insira um endereço de e-mail válido."),
  phone: z.string().min(9, "Por favor, insira um número de telefone com pelo menos 9 dígitos."),
  contactPreference: z.enum(["TELEFONE", "EMAIL"], {
    error: "Selecione como prefere ser contactado.",
  }),
  isWhatsapp: z.boolean().default(false),
  subject: z.string().min(1, "Selecione o tipo de intervenção ou assunto."),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().min(10, "Descreva detalhadamente o projeto ou intervenção desejada (mínimo 10 caracteres)."),
});

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      contactPreference: "TELEFONE",
      isWhatsapp: true,
      subject: "Reformas Gerais",
      preferredDate: "",
      preferredTime: "Manhã",
      message: "",
    },
  });

  const isWhatsapp = watch("isWhatsapp");
  const contactPreference = watch("contactPreference");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await submitLeadAction(data);

      if (response.success) {
        toast.success("Pedido de Orçamento Enviado!", {
          description: "Recebemos os seus dados. Um dos nossos especialistas entrará em contacto muito em breve.",
          duration: 5000,
        });
        setSubmittedSuccess(true);
        reset();
      } else {
        toast.error("Atenção ao submeter", {
          description: response.error || "Ocorreu uma falha. Por favor, tente novamente.",
        });
      }
    } catch (err: any) {
      toast.error("Erro inesperado", {
        description: "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-10 text-white relative overflow-hidden"
    >
      {/* Detalhe de iluminação industrial no topo */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-3">
          <Building2 className="w-3.5 h-3.5" />
          Orçamento Gratuito & Sem Compromisso
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Peça a sua Proposta à <span className="text-amber-500">Severino Remodelações</span>
        </h3>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Preencha o formulário abaixo. Analisamos cada detalhe com rigor técnico e rapidez para concretizar a sua obra.
        </p>
      </div>

      <AnimatePresence>
        {submittedSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 overflow-hidden"
          >
            <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-white">O seu pedido foi registado com sucesso!</p>
              <p className="text-zinc-300">A nossa equipa já se encontra a analisar o seu pedido.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        {/* Nome Completo */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
            Nome Completo *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <User className="w-4 h-4 text-amber-500/80" />
            </div>
            <input
              type="text"
              placeholder="Ex: Manuel Silva"
              {...register("name")}
              className={`w-full pl-10 pr-4 py-3 bg-zinc-950 border rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-zinc-800"
              }`}
            />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.name.message}</p>}
        </div>

        {/* E-mail e Telefone em grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* E-mail */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              E-mail *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4 text-amber-500/80" />
              </div>
              <input
                type="email"
                placeholder="exemplo@dominio.pt"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 bg-zinc-950 border rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-zinc-800"
                }`}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email.message}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Telefone / Telemóvel *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Phone className="w-4 h-4 text-amber-500/80" />
              </div>
              <input
                type="tel"
                placeholder="+351 912 345 678"
                {...register("phone")}
                className={`w-full pl-10 pr-4 py-3 bg-zinc-950 border rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.phone ? "border-red-500 focus:ring-red-500" : "border-zinc-800"
                }`}
              />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Preferência de Contacto + Checkbox WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Preferência de Contacto
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300 hover:text-white">
                <input
                  type="radio"
                  value="TELEFONE"
                  {...register("contactPreference")}
                  className="w-4 h-4 text-amber-500 accent-amber-500 focus:ring-amber-500"
                />
                Telefone
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300 hover:text-white">
                <input
                  type="radio"
                  value="EMAIL"
                  {...register("contactPreference")}
                  className="w-4 h-4 text-amber-500 accent-amber-500 focus:ring-amber-500"
                />
                E-mail
              </label>
            </div>
          </div>

          <div className="flex items-center sm:justify-end">
            <label className="inline-flex items-center gap-2.5 cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 px-3.5 py-2.5 rounded-lg text-sm transition-colors">
              <input
                type="checkbox"
                {...register("isWhatsapp")}
                className="w-4 h-4 text-amber-500 accent-amber-500 rounded focus:ring-amber-500"
              />
              <span className="flex items-center gap-1.5 text-zinc-200">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Este número é WhatsApp?
              </span>
            </label>
          </div>
        </div>

        {/* Assunto / Tipo de Obra */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
            Tipo de Obra ou Assunto *
          </label>
          <select
            {...register("subject")}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
          >
            <option value="Reformas Gerais">Reformas Gerais</option>
            <option value="Construção de Raiz">Construção de Raiz (Construção Nova)</option>
            <option value="Remodelação de Interiores">Remodelação de Interiores (Cozinhas, Casas de Banho)</option>
            <option value="Reabilitação de Fachadas">Reabilitação de Fachadas e Telhados</option>
            <option value="Pintura e Acabamentos">Pintura e Acabamentos Finos</option>
            <option value="Orçamento Geral / Outro">Outros / Orçamento Geral</option>
          </select>
          {errors.subject && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.subject.message}</p>}
        </div>

        {/* Preferência de Data e Horário para Visita */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Data Sugerida para Visita Técnica
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Calendar className="w-4 h-4 text-amber-500/80" />
              </div>
              <input
                type="date"
                {...register("preferredDate")}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Horário Preferencial de Visita
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Clock className="w-4 h-4 text-amber-500/80" />
              </div>
              <select
                {...register("preferredTime")}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              >
                <option value="Manhã (09h - 13h)">Manhã (09h - 13h)</option>
                <option value="Tarde (14h - 18h)">Tarde (14h - 18h)</option>
                <option value="Final do Dia (18h - 20h)">Final do Dia (18h - 20h)</option>
                <option value="Sem preferência">Sem preferência / Qualquer horário</option>
              </select>
            </div>
          </div>
        </div>

        {/* Textarea para Descrição Detalhada */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
            Descrição Detalhada do Projeto ou Obra *
          </label>
          <div className="relative">
            <textarea
              rows={4}
              placeholder="Indique a localização aproximada, dimensões da área, tipo de intervenção necessária e expectativas de prazo..."
              {...register("message")}
              className={`w-full p-4 bg-zinc-950 border rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-y ${
                errors.message ? "border-red-500 focus:ring-red-500" : "border-zinc-800"
              }`}
            />
          </div>
          {errors.message && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.message.message}</p>}
        </div>

        {/* Botão de Envio */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full py-4 px-6 rounded-xl font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              A enviar o seu pedido...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Solicitar Orçamento Gratuito
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-zinc-500">
          Ao submeter este formulário, concorda com o tratamento dos dados exclusivamente para contacto e apresentação da proposta comercial da Severino Remodelações.
        </p>
      </form>
    </motion.div>
  );
}

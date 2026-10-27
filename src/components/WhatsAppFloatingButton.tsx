"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppFloatingButton({
  phoneNumber = process.env.NEXT_PUBLIC_COMPANY_PHONE || "+351912345678",
  defaultMessage = "Olá! Gostaria de pedir um orçamento para obras e remodelações com a Severino Remodelações.",
}: WhatsAppFloatingButtonProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  // Limpa caracteres especiais mantendo apenas os dígitos
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2 pointer-events-auto">
      {/* Balão / Tooltip de convite */}
      {showTooltip && (
        <div className="relative flex items-center gap-3 bg-zinc-900/95 border border-amber-500/30 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-[260px] animate-fade-in transition-all">
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Fechar aviso"
            className="absolute -top-2 -left-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 p-1 rounded-full border border-zinc-700 transition"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-amber-400">Fale connosco agora</p>
            <p className="text-zinc-300">Tire dúvidas ou peça um orçamento rápido no WhatsApp!</p>
          </div>
        </div>
      )}

      {/* Botão Flutuante */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Onda de pulso de atenção */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-70 animate-ping pointer-events-none" />

        {/* Ícone de Mensagem / WhatsApp */}
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 fill-current" />
      </a>
    </div>
  );
}

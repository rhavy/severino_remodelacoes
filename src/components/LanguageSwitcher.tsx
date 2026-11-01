"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { localeNames, locales } from "@/lib/translations";

export function LanguageSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
  const { locale, setLocale, messages } = useLanguage();

  return (
    <details className={`relative ${fullWidth ? "w-full" : ""}`}>
      <summary
        aria-label={messages.header.language}
        className={`flex cursor-pointer list-none items-center gap-2 rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${
          fullWidth ? "w-full justify-between border border-zinc-800 px-3 py-2.5" : ""
        }`}
      >
        <span className="flex items-center gap-2">
          <Languages aria-hidden="true" className="h-5 w-5 text-amber-500" />
          {fullWidth && <span className="font-medium">{messages.header.language}</span>}
        </span>
        {!fullWidth && <span className="text-xs font-semibold uppercase">{locale}</span>}
      </summary>
      <div
        className={`absolute top-full z-[60] mt-2 min-w-52 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-xl ${
          fullWidth ? "left-0 w-full" : "right-0"
        }`}
      >
        {locales.map((option) => (
          <button
            key={option}
            type="button"
            aria-current={option === locale ? "true" : undefined}
            onClick={(event) => {
              setLocale(option);
              const details = event.currentTarget.closest("details");
              if (details) details.open = false;
            }}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-zinc-800 ${
              option === locale ? "font-bold text-amber-400" : "text-zinc-200"
            }`}
          >
            {localeNames[option]}
          </button>
        ))}
      </div>
    </details>
  );
}

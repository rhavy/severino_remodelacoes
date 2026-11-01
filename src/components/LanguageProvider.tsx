"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { locales, translations, type Locale, type TranslationMessages } from "@/lib/translations";

const LANGUAGE_COOKIE = "site-language";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: TranslationMessages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some((locale) => locale === value);
}

function readLanguageCookie(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${LANGUAGE_COOKIE}=`));

  return cookie ? decodeURIComponent(cookie.slice(LANGUAGE_COOKIE.length + 1)) : null;
}

function writeLanguageCookie(value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LANGUAGE_COOKIE}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

async function getRegionalLocale(): Promise<Locale> {
  const response = await fetch("/api/region", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to detect region: ${response.status}`);
  }

  const result: unknown = await response.json();
  if (
    typeof result === "object" &&
    result !== null &&
    "locale" in result &&
    isLocale(result.locale)
  ) {
    return result.locale;
  }

  return "pt-PT";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-PT");
  const [showPreferenceDialog, setShowPreferenceDialog] = useState(false);
  const [isChoosingRegion, setIsChoosingRegion] = useState(false);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    writeLanguageCookie(nextLocale);
  }, []);

  const chooseRegionalLanguage = useCallback(async () => {
    setIsChoosingRegion(true);
    writeLanguageCookie("region");

    try {
      setLocaleState(await getRegionalLocale());
    } catch (error) {
      console.error("Could not detect the visitor's region.", error);
      setLocaleState("pt-PT");
    } finally {
      setShowPreferenceDialog(false);
      setIsChoosingRegion(false);
    }
  }, []);

  useEffect(() => {
    const savedPreference = readLanguageCookie();

    if (savedPreference === "region") {
      getRegionalLocale()
        .then(setLocaleState)
        .catch((error: unknown) => {
          console.error("Could not detect the visitor's region.", error);
          setLocaleState("pt-PT");
        });
      return;
    }

    if (isLocale(savedPreference)) {
      setLocaleState(savedPreference);
      return;
    }

    setShowPreferenceDialog(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, messages: translations[locale] }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {showPreferenceDialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <section
            aria-labelledby="language-preference-title"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-white shadow-2xl sm:p-8"
            role="dialog"
          >
            <h2 id="language-preference-title" className="text-xl font-bold">
              {translations[locale].cookie.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              {translations[locale].cookie.description}
            </p>
            <p className="mt-5 text-sm font-semibold text-zinc-100">
              {translations[locale].cookie.question}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                disabled={isChoosingRegion}
                onClick={chooseRegionalLanguage}
                className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-70"
              >
                {translations[locale].cookie.region}
              </button>
              <button
                type="button"
                disabled={isChoosingRegion}
                onClick={() => {
                  setLocale("pt-PT");
                  setShowPreferenceDialog(false);
                }}
                className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-amber-500/60 hover:text-amber-300 disabled:opacity-70"
              >
                {translations[locale].cookie.standard}
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              {translations[locale].cookie.note}
            </p>
          </section>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}

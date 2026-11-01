import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { Locale } from "@/lib/translations";

const countryLocales: Partial<Record<string, Locale>> = {
  PT: "pt-PT",
  BR: "pt-PT",
  AO: "pt-PT",
  MZ: "pt-PT",
  CV: "pt-PT",
  GW: "pt-PT",
  ST: "pt-PT",
  TL: "pt-PT",
  GB: "en",
  US: "en",
  CA: "en",
  IE: "en",
  AU: "en",
  NZ: "en",
  ZA: "en",
  IN: "en",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  LU: "fr",
  MC: "fr",
  SN: "fr",
  CI: "fr",
  CM: "fr",
  CD: "fr",
  MG: "fr",
};

const languageLocales: Partial<Record<string, Locale>> = {
  pt: "pt-PT",
  en: "en",
  es: "es",
  fr: "fr",
};

export async function GET() {
  const requestHeaders = await headers();
  const country = (
    requestHeaders.get("x-vercel-ip-country") ??
    requestHeaders.get("cf-ipcountry") ??
    requestHeaders.get("x-country-code") ??
    ""
  ).toUpperCase();

  let locale: Locale | undefined = countryLocales[country];
  if (!locale) {
    const acceptedLanguage = requestHeaders.get("accept-language")?.split(",")[0];
    const language = acceptedLanguage?.split("-")[0].toLowerCase();
    locale = language ? languageLocales[language] : undefined;
  }

  return NextResponse.json({ locale: locale ?? "pt-PT" });
}

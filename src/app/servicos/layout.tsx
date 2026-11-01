import { LanguageProvider } from "@/components/LanguageProvider";

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

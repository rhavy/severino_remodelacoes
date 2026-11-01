import { LanguageProvider } from "@/components/LanguageProvider";

export default function ProjetosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

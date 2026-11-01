import { LanguageProvider } from "@/components/LanguageProvider";

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

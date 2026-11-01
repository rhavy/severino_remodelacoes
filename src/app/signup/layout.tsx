import { LanguageProvider } from "@/components/LanguageProvider";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

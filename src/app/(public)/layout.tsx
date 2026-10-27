import { Header } from "@/components/Header";
import { Footer } from "@/components/template/footer/page";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { Toaster } from "sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppFloatingButton />
      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}

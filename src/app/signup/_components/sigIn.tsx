"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
type MenuProps = {
  isOpen: boolean;
};
export function SigIn({ isOpen }: MenuProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.replace("/"),
      },
    });
  }

  return (
    <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="flex items-center gap-2 font-medium transition-all hover:bg-red-50 hover:text-red-600"
        >
        <LogOut className="w-4 h-4" />
        {isOpen && (<span>Sair</span>)}
        </Button>
    
  );
}

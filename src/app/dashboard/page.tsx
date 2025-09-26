// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardContent from "./_components/DashboardContent";

export default async function DashboardPage() {
   const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || !session?.user.emailVerified === true) {
      redirect("/");
    }

  return <DashboardContent username={session.user.name} />;
}

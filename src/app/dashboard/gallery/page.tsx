
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import GalleryContent from "./_components/GalletyContent";

export default async function GalleryPage() {
  const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session || !session?.user.emailVerified === true) {
        redirect("/");
      }

  return <GalleryContent username={session.user.name} />;
}

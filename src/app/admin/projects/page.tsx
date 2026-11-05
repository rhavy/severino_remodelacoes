import { prisma } from "@/lib/prisma";
import { ProjectManager } from "./_components/ProjectManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  // Buscar itens de portfólio/galeria salvos no banco de dados
  const projects = await prisma.galeria.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-3 sm:space-y-8 sm:p-5 2xl:p-10">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl 2xl:text-3xl">
          Gestão de Projetos & Portfólio (CRUD)
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Adicione, edite, oculte e remova projetos que compõem o catálogo de obras da Severino Remodelações
        </p>
      </div>

      <ProjectManager initialProjects={projects} />
    </div>
  );
}

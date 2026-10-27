import { prisma } from "@/lib/prisma";
import { ProjectManager } from "./_components/ProjectManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  // Buscar itens de portfólio/galeria salvos no banco de dados
  const projects = await prisma.galeria.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
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

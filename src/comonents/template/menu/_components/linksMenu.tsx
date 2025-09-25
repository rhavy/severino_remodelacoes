
interface limksProps {
  link: string;
  titulo: string;
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
  aparelho?: "web" | "mobile";
}

export default function LinksMenu({ link, titulo, icon, iconPosition = "right", aparelho = "web" }: limksProps) {
 return (
    <a href={link} className={ aparelho == "web" ? "flex items-center gap-2 text-gray-200 hover:text-yellow-400 transition" : "flex items-center gap-2 py-2 border-b border-slate-200 text-gray-200 hover:text-yellow-400"}>
       {iconPosition === "right"? (<>{titulo} {icon}</>) : (<>{icon} {titulo}</>)}
      </a>
  );
}
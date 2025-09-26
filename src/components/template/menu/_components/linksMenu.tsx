// linksMenu.tsx
import Link from "next/link";

type LinksMenuProps = {
  link: string;
  titulo: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  aparelho?: "web" | "mobile";
};

export default function LinksMenu({ link, titulo, icon, iconPosition = "left", aparelho = "web" }: LinksMenuProps) {
  return (
    <Link
      href={link}
      className={`
        flex items-center gap-2 font-medium 
        ${aparelho === "web" ? "text-gray-800 dark:text-white hover:text-yellow-500" : "text-gray-800 dark:text-white hover:text-yellow-500"} 
        transition
      `}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      <span>{titulo}</span>
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </Link>
  );
}

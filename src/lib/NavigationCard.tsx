import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface NavigationCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: string;
  description?: string;
  icon?: ReactNode;
}
export function NavigationCard({ title, description, icon, className = "", ...props }: NavigationCardProps) {
  return <button {...props} type={props.type || "button"} className={`fp-navigation-card ${className}`}>
    {icon && <span className="fp-navigation-card-icon">{icon}</span>}
    <span className="fp-navigation-card-copy"><strong>{title}</strong>{description && <span>{description}</span>}</span>
    <ChevronRight size={17} aria-hidden="true" />
  </button>;
}


import React from "react";
import { UtensilsCrossed } from "lucide-react";

interface MenuConfigHeaderProps {
  title: string;
}

const MenuConfigHeader: React.FC<MenuConfigHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2">
      <UtensilsCrossed className="h-5 w-5 text-zinc-500" />
      <h1 className="text-xl font-medium text-zinc-900">{title}</h1>
    </div>
  );
};

export default MenuConfigHeader;


import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface MenuHeaderProps {
  title: string;
  description: string;
  onAdd: () => void;
  isAdding: boolean;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ title, description, onAdd, isAdding }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onAdd} disabled={isAdding} size="sm">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

export default MenuHeader;

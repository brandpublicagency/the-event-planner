
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuToggleProps {
  onClick: () => void;
}

export const MobileMenuToggle = ({ onClick }: MobileMenuToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden h-7 w-7"
      onClick={onClick}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

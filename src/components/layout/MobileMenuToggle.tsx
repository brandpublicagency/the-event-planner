
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
      className="md:hidden h-6 w-6"
      onClick={onClick}
    >
      <Menu className="h-3.5 w-3.5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

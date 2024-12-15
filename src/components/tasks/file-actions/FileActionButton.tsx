import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FileActionButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: LucideIcon;
  disabled?: boolean;
  variant?: "ghost" | "destructive";
}

export function FileActionButton({ 
  onClick, 
  icon: Icon, 
  disabled, 
  variant = "ghost" 
}: FileActionButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          e.stopPropagation();
          onClick(e);
        }
      }}
      disabled={disabled}
      className="h-8 w-8"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
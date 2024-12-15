import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface FileActionButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: LucideIcon;
  disabled?: boolean;
  variant?: "ghost" | "destructive";
}

export const FileActionButton = forwardRef<HTMLButtonElement, FileActionButtonProps>(({ 
  onClick, 
  icon: Icon, 
  disabled, 
  variant = "ghost" 
}, ref) => {
  return (
    <Button
      ref={ref}
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
});

FileActionButton.displayName = "FileActionButton";
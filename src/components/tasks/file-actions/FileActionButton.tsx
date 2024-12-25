import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FileActionButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: LucideIcon;
  disabled?: boolean;
  variant?: "ghost" | "destructive";
  className?: string; // Add this line to include className
}

export const FileActionButton = forwardRef<HTMLButtonElement, FileActionButtonProps>(({ 
  onClick, 
  icon: Icon, 
  disabled, 
  variant = "ghost",
  className, // Add this to destructured props
}, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant}
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      disabled={disabled}
      className={cn("h-8 w-8", className)} // Use cn to merge classes
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
});

FileActionButton.displayName = "FileActionButton";
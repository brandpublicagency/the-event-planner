
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FileActionButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: LucideIcon;
  disabled?: boolean;
  variant?: "ghost" | "destructive" | "default";
  className?: string;
}

export const FileActionButton = forwardRef<HTMLButtonElement, FileActionButtonProps>(({ 
  onClick, 
  icon: Icon, 
  disabled, 
  variant = "ghost",
  className, 
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size="icon"
      onClick={handleClick}
      disabled={disabled}
      className={cn("h-5 w-5", className)}
    >
      <Icon className="h-2.5 w-2.5 text-zinc-400" />
    </Button>
  );
});

FileActionButton.displayName = "FileActionButton";


import React from 'react';
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface SaveButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void>;
  loadingText?: string;
  defaultText?: string;
}

export const SaveButton = ({
  onClick,
  loadingText = "Saving...",
  defaultText = "Save",
  className,
  disabled,
  ...props
}: SaveButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick();
      toast.success("Save completed");
    } catch (error: any) {
      console.error('Save operation failed:', error);
      toast.error(`Save failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative min-w-[120px]",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          <span>{loadingText}</span>
        </span>
      ) : (
        <span>{defaultText}</span>
      )}
    </Button>
  );
};

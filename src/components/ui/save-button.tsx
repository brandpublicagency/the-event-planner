
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { Loader2, Check } from "lucide-react";
import { toast } from "@/components/ui/toast";

export interface SaveButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void>;
  loadingText?: string;
  defaultText?: string;
  successText?: string;
  timeout?: number;
}

export const SaveButton = ({
  onClick,
  loadingText = "Saving...",
  defaultText = "Save",
  successText,
  timeout = 0,
  className,
  disabled,
  ...props
}: SaveButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isSuccess && successText && timeout > 0) {
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, timeout);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess, successText, timeout]);
  
  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // We don't show toast here as this is handled in the respective save functions
      await onClick();
      
      // Set success state for button UI
      if (successText) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      console.error('Save operation failed:', error);
      // Toast handled in the save functions
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
      ) : isSuccess && successText ? (
        <span className="flex items-center justify-center">
          <Check className="h-4 w-4 mr-1" />
          <span>{successText}</span>
        </span>
      ) : (
        <span>{defaultText}</span>
      )}
    </Button>
  );
};


import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { Check, Loader2 } from "lucide-react";

export interface SaveButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void>;
  successText?: string;
  loadingText?: string;
  defaultText?: string;
  showIcon?: boolean;
}

export const SaveButton = ({
  onClick,
  successText = "Saved",
  loadingText = "Saving...",
  defaultText = "Save",
  showIcon = true,
  className,
  disabled,
  ...props
}: SaveButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  // Reset to idle state after success
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === 'success') {
      timeout = setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  const handleClick = async () => {
    if (status === 'loading') return;
    
    try {
      setStatus('loading');
      await onClick();
      setStatus('success');
    } catch (error) {
      console.error('Save operation failed:', error);
      setStatus('idle');
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || status === 'loading'}
      className={cn(
        "relative transition-all duration-300 min-w-[100px]",
        status === 'success' && "bg-green-500 hover:bg-green-600 text-white border-green-500",
        status === 'loading' && "bg-gray-100 text-gray-600 border-gray-300",
        className
      )}
      {...props}
    >
      <span className={cn(
        "flex items-center justify-center gap-2",
        status === 'loading' && "opacity-0",
        status === 'success' && "opacity-0",
      )}>
        {defaultText}
      </span>
      
      {status === 'loading' && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          <span>{loadingText}</span>
        </span>
      )}
      
      {status === 'success' && (
        <span className="absolute inset-0 flex items-center justify-center">
          {showIcon && <Check className="h-4 w-4 mr-1" />}
          <span>{successText}</span>
        </span>
      )}
    </Button>
  );
};

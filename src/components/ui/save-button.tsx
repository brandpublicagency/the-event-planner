
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export interface SaveButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void>;
  successText?: string;
  loadingText?: string;
  defaultText?: string;
  showIcon?: boolean;
  timeout?: number;
}

export const SaveButton = ({
  onClick,
  successText = "Saved",
  loadingText = "Saving...",
  defaultText = "Save",
  showIcon = true,
  timeout = 5000,
  className,
  disabled,
  ...props
}: SaveButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Reset to idle state after success
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (status === 'success') {
      timeoutId = setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [status]);

  const handleClick = async () => {
    if (status === 'loading') return;
    
    try {
      setStatus('loading');
      setErrorMessage(null);
      
      // Set up timeout to prevent indefinite loading state
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout);
      });
      
      // Race between the actual operation and the timeout
      await Promise.race([
        onClick(),
        timeoutPromise
      ]);
      
      setStatus('success');
    } catch (error: any) {
      console.error('Save operation failed:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred');
      
      // Auto-reset from error state after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={disabled || status === 'loading'}
        className={cn(
          "relative transition-all duration-300 min-w-[120px]",
          status === 'success' && "bg-green-500 hover:bg-green-600 text-white border-green-500",
          status === 'error' && "bg-red-500 hover:bg-red-600 text-white border-red-500",
          status === 'loading' && "bg-gray-100 text-gray-600 border-gray-300",
          className
        )}
        {...props}
      >
        <span className={cn(
          "flex items-center justify-center gap-2",
          (status === 'loading' || status === 'success' || status === 'error') && "opacity-0",
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
        
        {status === 'error' && (
          <span className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Error</span>
          </span>
        )}
      </Button>
      
      {status === 'error' && errorMessage && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {errorMessage}
        </div>
      )}
    </div>
  );
};


import { createContext, useState, useEffect, ReactNode } from "react";
import { ToastOptions } from "./use-toast";

export interface ToastContextValue {
  toast: (options: ToastOptions) => { id: string };
  dismiss: (toastId?: string) => void;
  toasts: Array<{
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
    variant?: "default" | "destructive" | "success" | "info" | "warning";
    position?: "top" | "bottom" | "sidebar";
    showProgress?: boolean;
    duration?: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

// Define the maximum number of toasts to show at once
const MAX_TOASTS = 2;

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastContextValue["toasts"]>([]);

  const toast = (options: ToastOptions) => {
    const id = options.id || String(Date.now());
    
    setToasts((prevToasts) => {
      // If this exact toast already exists, don't add it again
      const existingToastIndex = prevToasts.findIndex(
        toast => toast.id === id || 
                (toast.title === options.title && 
                 toast.description === options.description)
      );
      
      if (existingToastIndex !== -1) {
        // Update existing toast
        const updatedToasts = [...prevToasts];
        updatedToasts[existingToastIndex] = {
          ...updatedToasts[existingToastIndex],
          ...options,
          id,
          open: true,
        };
        return updatedToasts;
      }
      
      // Filter out closed toasts first
      const activeToasts = prevToasts.filter(toast => toast.open);
      
      // Limit total number of toasts
      const filteredPrevToasts = activeToasts.length >= MAX_TOASTS 
        ? activeToasts.slice(-1) // Only keep the most recent toast
        : activeToasts;
      
      // Add new toast
      return [
        ...filteredPrevToasts,
        {
          ...options,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss(id);
          },
        },
      ];
    });

    return { id };
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      // Close specific toast
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === toastId ? { ...toast, open: false } : toast
        )
      );
      
      // Remove after animation (300ms)
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
      }, 300);
    } else {
      // Close all toasts
      setToasts((prevToasts) =>
        prevToasts.map((toast) => ({ ...toast, open: false }))
      );
      
      // Remove all after animation
      setTimeout(() => {
        setToasts([]);
      }, 300);
    }
  };

  // Expose toast API to window for global usage
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__TOAST_PROVIDER__ = { toast, dismiss };
    }
    
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__TOAST_PROVIDER__;
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};


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

// Track recently shown toast contents to avoid duplicates
const recentToasts = new Map<string, number>();

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastContextValue["toasts"]>([]);

  // Clean up old entries from recentToasts every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      recentToasts.forEach((timestamp, key) => {
        // Remove entries older than 10 seconds
        if (now - timestamp > 10000) {
          recentToasts.delete(key);
        }
      });
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const toast = (options: ToastOptions) => {
    const id = options.id || String(Date.now());
    
    // Create a deduplication key based on title and description
    const dedupeKey = `${options.title}:${options.description}`;
    
    // Check if we've shown this toast recently (within the last 10 seconds)
    if (recentToasts.has(dedupeKey)) {
      // Return existing ID without showing duplicate toast
      return { id };
    }
    
    // Remember this toast to prevent duplicates
    recentToasts.set(dedupeKey, Date.now());
    
    setToasts((prevToasts) => {
      const existingToastIndex = prevToasts.findIndex((toast) => toast.id === id);
      
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
      
      // Limit total number of toasts to 3 at a time
      const filteredPrevToasts = prevToasts.length >= 3 
        ? prevToasts.slice(-2) // Keep only the 2 most recent toasts
        : prevToasts;
      
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

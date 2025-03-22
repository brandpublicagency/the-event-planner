
import React, { createContext, useState, useEffect, ReactNode, useRef } from "react";
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
const MAX_TOASTS = 1;

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastContextValue["toasts"]>([]);
  const toastTimeoutsRef = useRef<Map<string, number>>(new Map());
  const instanceIdRef = useRef<string>(String(Date.now()));
  
  // Initialize provider once
  useEffect(() => {
    // Only expose toast API to window once
    if (typeof window !== "undefined" && !(window as any).__TOAST_PROVIDER__) {
      console.log('Setting up toast provider with ID:', instanceIdRef.current);
      (window as any).__TOAST_PROVIDER__ = { 
        toast: (options: ToastOptions) => toast(options),
        dismiss: (toastId?: string) => dismiss(toastId),
        instanceId: instanceIdRef.current 
      };
    }
    
    return () => {
      console.log('Cleaning up toast provider:', instanceIdRef.current);
      // Clear all timeouts
      toastTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      toastTimeoutsRef.current.clear();
      
      // Only remove window reference if this is the current instance
      if (typeof window !== "undefined" && 
          (window as any).__TOAST_PROVIDER__?.instanceId === instanceIdRef.current) {
        delete (window as any).__TOAST_PROVIDER__;
      }
    };
  }, []);

  const toast = (options: ToastOptions) => {
    const id = options.id || String(Date.now());
    
    // Create a hash key for deduplication
    const toastKey = `${options.variant || 'default'}:${String(options.title)}:${String(options.description)}`;

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
        ? [] // Clear all toasts if we've reached the limit
        : activeToasts;
      
      // Set auto-dismiss timeout
      const duration = options.duration || 5000;
      if (toastTimeoutsRef.current.has(id)) {
        window.clearTimeout(toastTimeoutsRef.current.get(id));
      }
      
      const timeoutId = window.setTimeout(() => {
        dismiss(id);
        toastTimeoutsRef.current.delete(id);
      }, duration);
      
      toastTimeoutsRef.current.set(id, timeoutId);
      
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
      const animationTimeout = window.setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
      }, 300);
      
      // Store the animation timeout
      toastTimeoutsRef.current.set(`animation-${toastId}`, animationTimeout);
    } else {
      // Close all toasts
      setToasts((prevToasts) =>
        prevToasts.map((toast) => ({ ...toast, open: false }))
      );
      
      // Remove all after animation
      const animationTimeout = window.setTimeout(() => {
        setToasts([]);
      }, 300);
      
      // Store the animation timeout
      toastTimeoutsRef.current.set('animation-all', animationTimeout);
    }
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

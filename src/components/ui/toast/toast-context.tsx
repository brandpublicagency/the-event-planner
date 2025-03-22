
import React, { createContext, ReactNode } from "react";
import { ToastOptions } from "./use-toast";
import { useToastManager, ManagedToast } from "./useToastManager";

export interface ToastContextValue {
  toast: (options: ToastOptions) => { id: string };
  dismiss: (toastId?: string) => void;
  toasts: ManagedToast[];
}

export const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toasts, toast, dismiss } = useToastManager();
  
  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

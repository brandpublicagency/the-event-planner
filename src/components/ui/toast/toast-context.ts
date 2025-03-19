
import { createContext } from "react";
import { ToastOptions } from "./use-toast";

export interface ToastContextValue {
  toast: (options: ToastOptions) => void;
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

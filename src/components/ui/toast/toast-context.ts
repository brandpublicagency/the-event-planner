
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
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

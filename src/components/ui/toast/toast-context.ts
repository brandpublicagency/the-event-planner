
import { createContext } from "react";
import { ToastOptions } from "./use-toast";

export interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (toastId?: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

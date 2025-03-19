
import { useContext } from "react";
import { ToastContext } from "@/components/ui/toast/toast-context";
import { ToastProps, ToastActionElement } from "@/components/ui/toast/toast";

export interface ToastOptions extends ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  position?: "top" | "bottom" | "sidebar";
  showProgress?: boolean;
}

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

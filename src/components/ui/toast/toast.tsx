
import * as React from "react"
import { X, CheckCircle2, AlertCircle, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as ToastPrimitives from "@radix-ui/react-toast"

// Define ToastProps separately without extending Radix props to avoid the circular reference
export interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  position?: "top" | "bottom" | "sidebar";
  showProgress?: boolean;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
  // Add other needed props from RadixUI without extending
  className?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
  onSwipeStart?: (event: React.TouchEvent | MouseEvent) => void;
  onSwipeMove?: (event: React.TouchEvent | MouseEvent) => void;
  onSwipeEnd?: (event: React.TouchEvent | MouseEvent) => void;
  forceMount?: true;
  altText?: string;
}

export type ToastActionElement = React.ReactElement<typeof ToastPrimitives.Action>

// This is a client-side only function
export const toast = ({
  variant = "default",
  title,
  description,
  duration = 5000,
  action,
  position = "bottom",
  showProgress = false,
  ...props
}: ToastProps) => {
  // We access the clientside toast implementation and inject our custom props
  if (typeof window === "undefined") return { id: "server-toast" }; // Return a dummy ID when rendering on server
  
  const { toast: clientToast } = (window as any).__TOAST_PROVIDER__ || {};
  
  if (!clientToast) {
    console.error("Toast provider not found. Make sure ToastProvider is mounted.");
    return { id: "error-toast" };
  }
  
  return clientToast({
    variant,
    title,
    description,
    duration,
    action,
    position,
    showProgress,
    ...props,
  });
};

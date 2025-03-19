
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
  const { toast: clientToast } = (window as any).__TOAST_PROVIDER__;
  
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


import { type ToastActionElement, type ToastProps as PrimitiveToastProps } from "@/components/ui/toast";

export interface ToastProps extends PrimitiveToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  position?: "top" | "bottom" | "sidebar";
  showProgress?: boolean;
}

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

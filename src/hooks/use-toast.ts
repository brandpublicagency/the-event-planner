
// Re-export toast functions from the Sonner library for consistent usage
import { toast as sonnerToast, Toast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

// Create a more React-like hook interface
export const useToast = () => {
  const toast = (props: ToastProps) => {
    const { title, description, variant = "default", action } = props;
    
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        action
      });
    }
    
    return sonnerToast(title, {
      description,
      action
    });
  };

  return {
    toast
  };
};

// Export individual toast functions for direct usage
export const toast = {
  // Basic toast
  success: (message: string, options?: any) => {
    return sonnerToast.success(message, options);
  },
  
  error: (message: string, options?: any) => {
    return sonnerToast.error(message, options);
  },
  
  warning: (message: string, options?: any) => {
    return sonnerToast.warning(message, options);
  },
  
  info: (message: string, options?: any) => {
    return sonnerToast.info(message, options);
  },
  
  // Default toast
  default: (message: string, options?: any) => {
    return sonnerToast(message, options);
  },
  
  // Promise toast
  promise: (promise: Promise<any>, options: any) => {
    return sonnerToast.promise(promise, options);
  },
  
  // Custom toast with options
  custom: (options: any) => {
    return sonnerToast(options);
  },
  
  // Dismiss all toasts
  dismiss: () => sonnerToast.dismiss(),
  
  // Loading toast
  loading: (message: string, options?: any) => {
    return sonnerToast.loading(message, options);
  }
};

// Also export the dismiss function directly
export const dismiss = sonnerToast.dismiss;

// Also export the loading, success, error functions directly
export const loading = sonnerToast.loading;
export const success = sonnerToast.success;
export const error = sonnerToast.error;
export const info = sonnerToast.info;
export const warning = sonnerToast.warning;


import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  id?: string;
};

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 4000, action, id }: ToastProps) => {
    const toastFn = getToastFunction(variant);
    
    return toastFn(title || '', {
      description,
      duration,
      id,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

// Get the appropriate toast function based on variant
function getToastFunction(variant: ToastProps['variant']) {
  switch (variant) {
    case 'destructive':
      return sonnerToast.error;
    case 'success':
      return sonnerToast.success;
    case 'info':
      return sonnerToast.info;
    case 'warning':
      return sonnerToast.warning;
    default:
      return sonnerToast;
  }
}

// Create a wrapper function for the toast with all the methods
const createToast = () => {
  const baseToast = ({ title, description, variant = 'default', duration = 4000, action, id }: ToastProps) => {
    const toastFn = getToastFunction(variant);
    
    return toastFn(title || '', {
      description,
      duration,
      id,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  };
  
  // Adding utility methods to the base toast function
  baseToast.loading = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    return sonnerToast.loading(title, options);
  };
  
  baseToast.success = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    return sonnerToast.success(title, options);
  };
  
  baseToast.error = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    return sonnerToast.error(title, options);
  };
  
  baseToast.info = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    return sonnerToast.info(title, options);
  };
  
  baseToast.warning = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    return sonnerToast.warning(title, options);
  };
  
  baseToast.dismiss = sonnerToast.dismiss;
  
  return baseToast;
};

// Export the enhanced toast function
export const toast = createToast();

// Export sonner's dismiss function
export const dismiss = sonnerToast.dismiss;

// Export sonner's other utility functions directly
export const loading = sonnerToast.loading;
export const success = sonnerToast.success;
export const error = sonnerToast.error;
export const info = sonnerToast.info;
export const warning = sonnerToast.warning;

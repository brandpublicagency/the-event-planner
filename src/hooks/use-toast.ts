
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

// Standalone toast function for direct imports
export const toast = ({ title, description, variant = 'default', duration = 4000, action, id }: ToastProps) => {
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

// Export sonner's dismiss function
export const dismiss = sonnerToast.dismiss;

// Export sonner's other utility functions
export const loading = sonnerToast.loading;
export const success = sonnerToast.success;
export const error = sonnerToast.error;
export const info = sonnerToast.info;
export const warning = sonnerToast.warning;


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
};

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 5000, action }: ToastProps) => {
    const toastFn = getToastFunction(variant);
    
    return toastFn(title || '', {
      description,
      duration,
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

// Standalone toast function
export const toast = ({ title, description, variant = 'default', duration = 5000, action }: ToastProps) => {
  const toastFn = getToastFunction(variant);
  
  return toastFn(title || '', {
    description,
    duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  });
};

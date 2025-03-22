import { toast as sonnerToast, Toast } from "sonner";

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
    const variantConfig = {
      default: {},
      destructive: { style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' } },
      success: { style: { backgroundColor: 'rgb(22, 163, 74)', color: 'white' } },
      info: { style: { backgroundColor: 'rgb(59, 130, 246)', color: 'white' } },
      warning: { style: { backgroundColor: 'rgb(245, 158, 11)', color: 'white' } }
    };

    return sonnerToast(title || '', {
      description,
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      ...variantConfig[variant]
    });
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

// Standalone toast function
export const toast = ({ title, description, variant = 'default', duration = 5000, action }: ToastProps) => {
  const variantConfig = {
    default: {},
    destructive: { style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' } },
    success: { style: { backgroundColor: 'rgb(22, 163, 74)', color: 'white' } },
    info: { style: { backgroundColor: 'rgb(59, 130, 246)', color: 'white' } },
    warning: { style: { backgroundColor: 'rgb(245, 158, 11)', color: 'white' } }
  };

  return sonnerToast(title || '', {
    description,
    duration,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    ...variantConfig[variant]
  });
};
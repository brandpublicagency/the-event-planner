
import { toast as sonnerToast } from "sonner";

type ToastVariant = 'default' | 'destructive' | 'success' | 'info' | 'warning';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  id?: string;
};

// Toast queue management
const MAX_TOASTS = 3;
const toastQueue: Array<{ id: string; priority: number }> = [];
const PRIORITY_MAP: Record<ToastVariant, number> = {
  destructive: 4,
  warning: 3,
  success: 2,
  info: 1,
  default: 1,
};

function manageToastQueue(variant: ToastVariant = 'default', id?: string) {
  const priority = PRIORITY_MAP[variant];
  const toastId = id || `toast-${Date.now()}`;
  
  // Add to queue
  toastQueue.push({ id: toastId, priority });
  
  // Sort by priority (higher first)
  toastQueue.sort((a, b) => b.priority - a.priority);
  
  // Dismiss low-priority toasts if we exceed max
  if (toastQueue.length > MAX_TOASTS) {
    const toRemove = toastQueue.slice(MAX_TOASTS);
    toRemove.forEach(t => sonnerToast.dismiss(t.id));
    toastQueue.splice(MAX_TOASTS);
  }
  
  return toastId;
}

// Type guard for toast variant
function isValidVariant(variant: string): variant is ToastVariant {
  return ['default', 'destructive', 'success', 'info', 'warning'].includes(variant);
}

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 4000, action, id }: ToastProps) => {
    if (variant && !isValidVariant(variant)) {
      console.warn(`Invalid toast variant: ${variant}. Using default.`);
      variant = 'default';
    }
    
    const toastId = manageToastQueue(variant, id);
    const toastFn = getToastFunction(variant);
    
    return toastFn(title || '', {
      description,
      duration,
      id: toastId,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  };

  return {
    toast,
    dismiss: (id?: string) => {
      if (id) {
        const index = toastQueue.findIndex(t => t.id === id);
        if (index !== -1) toastQueue.splice(index, 1);
      }
      sonnerToast.dismiss(id);
    },
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
    if (variant && !isValidVariant(variant)) {
      console.warn(`Invalid toast variant: ${variant}. Using default.`);
      variant = 'default';
    }
    
    const toastId = manageToastQueue(variant, id);
    const toastFn = getToastFunction(variant);
    
    return toastFn(title || '', {
      description,
      duration,
      id: toastId,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  };
  
  // Adding utility methods to the base toast function
  baseToast.loading = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    const toastId = manageToastQueue('default', options?.id);
    return sonnerToast.loading(title, { ...options, id: toastId });
  };
  
  baseToast.success = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    const toastId = manageToastQueue('success', options?.id);
    return sonnerToast.success(title, { ...options, id: toastId });
  };
  
  baseToast.error = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    const toastId = manageToastQueue('destructive', options?.id);
    return sonnerToast.error(title, { ...options, id: toastId });
  };
  
  baseToast.info = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    const toastId = manageToastQueue('info', options?.id);
    return sonnerToast.info(title, { ...options, id: toastId });
  };
  
  baseToast.warning = (title: string, options?: Omit<ToastProps, 'title' | 'variant'>) => {
    const toastId = manageToastQueue('warning', options?.id);
    return sonnerToast.warning(title, { ...options, id: toastId });
  };
  
  baseToast.dismiss = (id?: string) => {
    if (id) {
      const index = toastQueue.findIndex(t => t.id === id);
      if (index !== -1) toastQueue.splice(index, 1);
    }
    sonnerToast.dismiss(id);
  };
  
  return baseToast;
};

// Export the enhanced toast function
export const toast = createToast();

// Export sonner's dismiss function with queue management
export const dismiss = (id?: string) => {
  if (id) {
    const index = toastQueue.findIndex(t => t.id === id);
    if (index !== -1) toastQueue.splice(index, 1);
  }
  sonnerToast.dismiss(id);
};

// Export sonner's other utility functions with queue management
export const loading = (title: string, options?: any) => {
  const toastId = manageToastQueue('default', options?.id);
  return sonnerToast.loading(title, { ...options, id: toastId });
};

export const success = (title: string, options?: any) => {
  const toastId = manageToastQueue('success', options?.id);
  return sonnerToast.success(title, { ...options, id: toastId });
};

export const error = (title: string, options?: any) => {
  const toastId = manageToastQueue('destructive', options?.id);
  return sonnerToast.error(title, { ...options, id: toastId });
};

export const info = (title: string, options?: any) => {
  const toastId = manageToastQueue('info', options?.id);
  return sonnerToast.info(title, { ...options, id: toastId });
};

export const warning = (title: string, options?: any) => {
  const toastId = manageToastQueue('warning', options?.id);
  return sonnerToast.warning(title, { ...options, id: toastId });
};

// Export types
export type { ToastVariant, ToastProps };

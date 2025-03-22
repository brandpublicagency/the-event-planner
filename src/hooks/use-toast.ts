
import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'info' | 'warning';
  position?: 'top' | 'bottom' | 'sidebar';
  duration?: number;
  action?: React.ReactNode;
  showProgress?: boolean;
}

export const useToast = () => {
  // Create a toast function that properly maps to sonner
  const toast = (props: ToastProps) => {
    const { title, description, variant = 'default', duration } = props;
    
    // Map our variant to sonner's type
    const typeMap: Record<string, any> = {
      'default': undefined,
      'destructive': { style: { backgroundColor: 'rgb(220, 38, 38)' }, className: 'text-white' },
      'success': { style: { backgroundColor: 'rgb(22, 163, 74)' }, className: 'text-white' },
      'info': { style: { backgroundColor: 'rgb(59, 130, 246)' }, className: 'text-white' },
      'warning': { style: { backgroundColor: 'rgb(245, 158, 11)' }, className: 'text-white' }
    };
    
    return sonnerToast(title, {
      description,
      duration,
      ...typeMap[variant]
    });
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
    toasts: [] // Sonner manages the toast list internally
  };
};

// Also export a standalone toast function for use without the hook
export const toast = (props: ToastProps) => {
  const { title, description, variant = 'default', duration } = props;
  
  // Map our variant to sonner's type
  const typeMap: Record<string, any> = {
    'default': undefined,
    'destructive': { style: { backgroundColor: 'rgb(220, 38, 38)' }, className: 'text-white' },
    'success': { style: { backgroundColor: 'rgb(22, 163, 74)' }, className: 'text-white' },
    'info': { style: { backgroundColor: 'rgb(59, 130, 246)' }, className: 'text-white' },
    'warning': { style: { backgroundColor: 'rgb(245, 158, 11)' }, className: 'text-white' }
  };
  
  return sonnerToast(title, {
    description,
    duration,
    ...typeMap[variant]
  });
};

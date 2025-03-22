
// This is a placeholder implementation that doesn't render any toasts
// but mimics the original API to avoid breaking changes

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
  // Create a toast function that logs to console but doesn't show UI
  const toast = (props: ToastProps) => {
    console.log(`Toast (${props.variant || 'default'}): ${props.title}${props.description ? ` - ${props.description}` : ''}`);
    return { id: 'no-op' };
  };

  return {
    toast,
    dismiss: () => {},
    toasts: []
  };
};

export const toast = (props: ToastProps) => {
  console.log(`Toast (${props.variant || 'default'}): ${props.title}${props.description ? ` - ${props.description}` : ''}`);
  return { id: 'no-op' };
};

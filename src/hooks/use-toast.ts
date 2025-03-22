
export const useToast = () => {
  // This is a placeholder that does nothing
  return {
    toast: () => ({ id: 'no-op' }),
    dismiss: () => {},
    toasts: []
  };
};

export const toast = () => ({ id: 'no-op' });

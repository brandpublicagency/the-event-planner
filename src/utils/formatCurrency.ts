// We're keeping this utility in case we need to format currency values elsewhere
// in the application, but it's no longer used for menu items

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
  }).format(amount);
};

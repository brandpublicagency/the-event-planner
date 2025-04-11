
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const getPredefinedCategories = (templateType: string): string[] => {
  switch (templateType) {
    case 'buffet-menu':
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    case 'warm-karoo-feast':
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    case 'plated-menu':
      return ["MAIN SELECTION", "SALAD"];
    case 'dessert-canapes':
      return ["DESSERT CANAPÉS"];
    case 'individual-cakes':
      return ["INDIVIDUAL CAKES"];
    case 'baked-desserts':
      return ["BAKED DESSERTS"];
    case 'custom':
      return [];
    default:
      return [];
  }
};

export const getNextDisplayOrder = (items: { display_order: number }[]): number => {
  if (!items.length) return 0;
  return Math.max(...items.map(item => item.display_order)) + 1;
};

export const generateUniqueValue = (
  label: string, 
  existingValues: string[]
): string => {
  const baseValue = toSlug(label);
  
  if (!existingValues.includes(baseValue)) {
    return baseValue;
  }
  
  let counter = 1;
  let newValue = `${baseValue}-${counter}`;
  
  while (existingValues.includes(newValue)) {
    counter++;
    newValue = `${baseValue}-${counter}`;
  }
  
  return newValue;
};

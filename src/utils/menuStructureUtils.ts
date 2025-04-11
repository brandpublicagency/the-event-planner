/**
 * Convert a string to a slug/kebab case for use as a unique identifier
 * e.g. "Roast Beef" -> "roast-beef"
 */
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');   // Trim hyphens from start and end
};

/**
 * Get unique categories from a list of menu items
 */
export const getUniqueCategories = (items: Array<{category: string | null}>): string[] => {
  const categories = items
    .map(item => item.category)
    .filter((category): category is string => !!category);
  
  return [...new Set(categories)];
};

/**
 * Group menu items by category
 */
export const groupItemsByCategory = <T extends {category: string | null}>(
  items: T[]
): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};
  
  // First create an "uncategorized" group
  grouped['uncategorized'] = items.filter(item => !item.category);
  
  // Then group by each category
  const categories = getUniqueCategories(items);
  categories.forEach(category => {
    grouped[category] = items.filter(item => item.category === category);
  });
  
  return grouped;
};

/**
 * Get predefined categories based on choice type
 */
export const getPredefinedCategories = (choiceType: string): string[] => {
  const choiceValue = choiceType.toLowerCase();
  
  if (choiceValue.includes('buffet')) {
    return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
  }
  
  if (choiceValue.includes('karoo')) {
    return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
  }
  
  if (choiceValue.includes('plated')) {
    return ["MAIN SELECTION", "SALAD"];
  }
  
  if (choiceValue.includes('canape') || choiceValue.includes('canapé')) {
    return ["CANAPE SELECTIONS"];
  }
  
  if (choiceValue.includes('dessert')) {
    return ["DESSERT OPTIONS"];
  }
  
  if (choiceValue.includes('cake')) {
    return ["INDIVIDUAL CAKES"];
  }
  
  if (choiceValue.includes('baked')) {
    return ["BAKED DESSERTS"];
  }
  
  return [];
};

/**
 * Get display order for a new item
 */
export const getNextDisplayOrder = (items: Array<{display_order?: number}>): number => {
  if (!items.length) return 0;
  
  const maxOrder = Math.max(...items.map(item => item.display_order || 0));
  return maxOrder + 1;
};

/**
 * Generate a unique value based on a label
 */
export const generateUniqueValue = (
  label: string, 
  existingValues: string[]
): string => {
  const baseValue = toSlug(label);
  
  // If the base value doesn't exist, return it
  if (!existingValues.includes(baseValue)) {
    return baseValue;
  }
  
  // Otherwise, append a number
  let counter = 1;
  let newValue = `${baseValue}-${counter}`;
  
  while (existingValues.includes(newValue)) {
    counter++;
    newValue = `${baseValue}-${counter}`;
  }
  
  return newValue;
};

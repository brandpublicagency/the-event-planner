
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

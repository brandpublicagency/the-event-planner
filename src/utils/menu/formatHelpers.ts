
/**
 * Formats a section header with consistent styling
 */
export const formatSectionHeader = (title: string): string => {
  return `\n* ${title.toUpperCase()}:\n`;
};

/**
 * Format notes section with proper formatting
 */
export const formatNotesSection = (notes: string | undefined): string => {
  if (!notes || notes.trim() === '') return '';
  
  let section = formatSectionHeader('ADDITIONAL NOTES');
  section += notes;
  
  return section;
};

/**
 * Format custom menu details
 */
export const formatCustomMenuDetails = (customMenuDetails: string | undefined): string => {
  if (!customMenuDetails) return '';
  
  return customMenuDetails;
};

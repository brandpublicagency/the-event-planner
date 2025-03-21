
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
  
  // Replace any underscores in the custom menu text
  return customMenuDetails.replace(/_/g, ' ');
};

/**
 * Clean item description by replacing underscores with spaces
 */
export const cleanItemDescription = (description: string): string => {
  return description.replace(/_/g, ' ');
};

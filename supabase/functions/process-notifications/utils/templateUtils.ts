
/**
 * Process a notification template by replacing template variables with actual values
 */
export function processTemplate(template: string, data: Record<string, any>): string {
  if (!template) return '';
  
  // Replace all placeholders in format {variable_name} with actual values
  return template.replace(/{([^}]+)}/g, (match, key) => {
    // Make sure the key exists in data
    if (data[key] !== undefined) {
      return data[key];
    }
    
    // Support for nested properties with dot notation
    if (key.includes('.')) {
      const parts = key.split('.');
      let value = data;
      
      for (const part of parts) {
        if (value === undefined || value === null) return match;
        value = value[part];
      }
      
      return value !== undefined ? value : match;
    }
    
    // Return the original placeholder if no replacement found
    return match;
  });
}

/**
 * Format date values for templates
 * @param date ISO date string or Date object
 * @param format Optional format (short, medium, long)
 */
export function formatDateForTemplate(date: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: format === 'short' ? 'short' : 'long', 
      day: 'numeric' 
    };
    
    if (format === 'long') {
      options.weekday = 'long';
    }
    
    return dateObj.toLocaleDateString('en-US', options);
  } catch (e) {
    console.error('Error formatting date:', e);
    return String(date);
  }
}

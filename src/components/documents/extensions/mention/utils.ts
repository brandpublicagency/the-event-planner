
import { MentionResult, MentionGroup } from './types';

// Create a debounced function
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Group items by type and organize them for display
export const groupItems = (items: MentionResult[]) => {
  const grouped: {[key: string]: MentionResult[]} = {
    document: [],
    task: [],
    event: [],
    user: []
  };
  
  items.forEach(item => {
    if (grouped[item.type]) {
      grouped[item.type].push(item);
    }
  });
  
  // Return a flattened array with group headers
  const result: any[] = [];
  
  // Define display order and icons
  const groups: MentionGroup[] = [
    { type: 'document', label: 'Documents', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>', color: 'text-amber-500' },
    { type: 'task', label: 'Tasks', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>', color: 'text-red-500' },
    { type: 'event', label: 'Events', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>', color: 'text-green-500' },
    { type: 'user', label: 'Users', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', color: 'text-blue-500' }
  ];
  
  groups.forEach(group => {
    if (grouped[group.type].length > 0) {
      // Add header
      result.push({
        type: 'header',
        title: group.label,
        isHeader: true
      });
      
      // Add items with icons and colors
      grouped[group.type].forEach(item => {
        item.icon = group.icon;
        item.color = group.color;
        result.push(item);
      });
    }
  });
  
  return result;
};

// Loading template function
export const getLoadingTemplate = () => {
  return '<div class="tribute-item tribute-item-loading">' +
    '<div class="loading-spinner"></div>' +
    '<span>Searching...</span>' +
  '</div>';
};

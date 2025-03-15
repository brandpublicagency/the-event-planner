
// Export all chat context utils from this central file

// Export functions from their correct source files
export { 
  formatEventForContext,
  prepareEventsContext
} from './eventContextUtils';

export { 
  prepareTasksContext 
} from './taskContextUtils';

export { 
  prepareContactsContext 
} from './contactContextUtils';

export { 
  prepareDocumentsContext 
} from './documentContextUtils';

export { 
  getSystemMessage 
} from './systemMessageUtils';

// Export the utility files themselves (not as default exports)
export * as eventContextUtils from './eventContextUtils';
export * as taskContextUtils from './taskContextUtils';
export * as contactContextUtils from './contactContextUtils';
export * as documentContextUtils from './documentContextUtils';

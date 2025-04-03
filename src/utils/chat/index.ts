
// Export chat utility functions for better organization and access
export { formatEventForContext, prepareEventsContext } from './eventContextUtils';
export { prepareTasksContext } from './taskContextUtils';
export { prepareContactsContext } from './contactContextUtils';
export { prepareDocumentsContext } from './documentContextUtils';

// Also provide namespace exports for more flexible imports
export * as eventUtils from './eventContextUtils';
export * as taskUtils from './taskContextUtils';
export * as contactUtils from './contactContextUtils';
export * as documentUtils from './documentContextUtils';

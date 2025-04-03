
import { Event } from "@/types/event";
import { Task } from "@/contexts/task/taskTypes";
import { format } from "date-fns";

// Re-export all utilities from the new files
export { 
  formatEventForContext,
  prepareEventsContext,
  prepareTasksContext,
  prepareContactsContext,
  prepareDocumentsContext
} from './chat';

// Since getSystemMessage is not available from the chat module, we'll provide it here
export const getSystemMessage = (
  eventsContext: string,
  contactsContext: string,
  documentsContext: string,
  pdfContent: string,
  tasksContext: string
): string => {
  // Simple implementation that combines all context data
  return `
You are an assistant with access to the following data:

${eventsContext}

${contactsContext}

${documentsContext}

${tasksContext}

${pdfContent ? `PDF CONTENT:\n${pdfContent}` : ''}
`;
};

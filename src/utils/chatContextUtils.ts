// If this file exists, we need to add the getSystemMessage function or fix the import
// Assuming we need to add this function and that chatContextUtils.ts is used to create system messages for chat contexts

import { formatCurrency } from "./formatCurrency";
import { formatDate } from "./formatDate";
import { formatEventDetails } from "./formatEventDetails";
import { formatClientDetails } from "./formatClientDetails";
// Removed formatMenuDetails import as it no longer exists
// Remove the problematic import 
// import { getSystemMessage } from "./chat";

export const chatContextTypes = [
  "event",
  "contact",
  "document",
  "task",
] as const;

export type ChatContextType = typeof chatContextTypes[number];

export interface ChatContextData {
  type: ChatContextType;
  data: any;
}

// Implement this function which seems to be missing
export const getSystemMessage = (contextData: ChatContextData) => {
  if (!contextData) {
    return "No context data provided.";
  }

  switch (contextData.type) {
    case "event":
      return getEventContext(contextData.data);
    case "contact":
      return getContactContext(contextData.data);
    case "document":
      return getDocumentContext(contextData.data);
    case "task":
      return getTaskContext(contextData.data);
    default:
      return "Unknown context type.";
  }
};

const getEventContext = (event: any) => {
  if (!event) {
    return "No event data provided.";
  }

  const eventDetails = formatEventDetails(event);
  const clientDetails = formatClientDetails(event);

  return `
  Event Details:
  ${eventDetails}

  Client Details:
  ${clientDetails}
  `;
};

const getContactContext = (contact: any) => {
  if (!contact) {
    return "No contact data provided.";
  }

  return `
  Contact Details:
  Name: ${contact.name}
  Email: ${contact.email}
  Phone: ${contact.phone}
  `;
};

const getDocumentContext = (document: any) => {
  if (!document) {
    return "No document data provided.";
  }

  return `
  Document Details:
  Name: ${document.name}
  Type: ${document.type}
  `;
};

const getTaskContext = (task: any) => {
  if (!task) {
    return "No task data provided.";
  }

  return `
  Task Details:
  Name: ${task.name}
  Description: ${task.description}
  Status: ${task.status}
  `;
};

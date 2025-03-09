
import { WhatsAppResponse } from '../../../utils/timeoutUtils.ts';
import { 
  fetchEvents, 
  fetchContacts, 
  fetchDocuments, 
  fetchTasks,
  checkDatabaseConnection 
} from '../../../utils/dataFetcher/index.ts';
import { withTimeout } from '../../../utils/timeoutUtils.ts';
import { handleTimeoutError } from '../../../utils/timeoutUtils.ts';
import { formatEventsContext, formatContactsContext, formatDocumentsContext, formatTasksContext } from '../../../utils/contextFormatter.ts';

// Helper function to fetch all context data in parallel
export async function fetchContextData() {
  const eventsPromise = withTimeout(fetchEvents(), 'fetchEvents', 10000);
  const contactsPromise = withTimeout(fetchContacts(), 'fetchContacts', 10000);
  const documentsPromise = withTimeout(fetchDocuments(), 'fetchDocuments', 10000);
  const tasksPromise = withTimeout(fetchTasks(), 'fetchTasks', 10000);
  
  const [events, contacts, documents, tasks] = await Promise.all([
    eventsPromise.catch(err => {
      console.error('Error fetching events:', err);
      return [];
    }),
    contactsPromise.catch(err => {
      console.error('Error fetching contacts:', err);
      return [];
    }),
    documentsPromise.catch(err => {
      console.error('Error fetching documents:', err);
      return [];
    }),
    tasksPromise.catch(err => {
      console.error('Error fetching tasks:', err);
      return [];
    })
  ]);
  
  return { events, contacts, documents, tasks };
}

// Check if a question is event-related
export function isEventQuestion(question: string): boolean {
  const eventRelatedTerms = ['event', 'party', 'wedding', 'function', 'gathering', 'ceremony'];
  return eventRelatedTerms.some(term => question.toLowerCase().includes(term));
}

// Generate a fallback response when AI fails
export function generateFallbackResponse(question: string): WhatsAppResponse {
  let fallbackResponse = "I apologize, but I'm having trouble generating a detailed response at the moment.";
  
  if (question.toLowerCase().includes('event')) {
    fallbackResponse += " You can use commands like 'next event' or 'events' to see upcoming events.";
  } else if (question.toLowerCase().includes('task')) {
    fallbackResponse += " You can use commands like 'tasks' or 'next task' to see your pending tasks.";
  } else {
    fallbackResponse += " Please try specific commands like 'help', 'events', or 'tasks'.";
  }
  
  return {
    type: 'text',
    message: fallbackResponse
  };
}

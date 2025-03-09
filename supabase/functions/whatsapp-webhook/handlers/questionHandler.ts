
import { handleTimeoutError } from '../utils/timeoutUtils.ts';
import { fetchEvents, fetchContacts, fetchDocuments, fetchTasks } from '../utils/dataFetcher.ts';
import { formatEventsContext, formatContactsContext, formatDocumentsContext, formatTasksContext, createSystemPrompt } from '../utils/contextFormatter.ts';
import { generateCompletion } from '../services/aiService.ts';

export const handleAIQuestion = async (question: string) => {
  try {
    console.log('Processing AI question:', question);
    
    // Fetch all required data
    const events = await fetchEvents();
    const contacts = await fetchContacts();
    const documents = await fetchDocuments();
    const tasks = await fetchTasks();
    
    // Format the context data for each entity type
    const eventsContext = formatEventsContext(events);
    const contactsContext = formatContactsContext(contacts);
    const documentsContext = formatDocumentsContext(documents);
    const tasksContext = formatTasksContext(tasks);
    
    // Create the system prompt for the AI
    const systemPrompt = createSystemPrompt(eventsContext, contactsContext, documentsContext, tasksContext);
    
    // Generate the AI completion using the formatted context
    const answer = await generateCompletion(systemPrompt, question);

    return {
      type: 'text',
      message: answer
    };
  } catch (error) {
    console.error('Error handling AI question:', error);
    return handleTimeoutError(error);
  }
};

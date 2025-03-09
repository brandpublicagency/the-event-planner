
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { getSystemMessage } from '../../utils/systemMessageUtils.ts';
import { handleTimeoutError, withTimeout, WhatsAppResponse } from '../../utils/timeoutUtils.ts';
import { checkDatabaseConnection } from '../../utils/dataFetcher/index.ts';
import { formatEventsContext, formatContactsContext, formatDocumentsContext, formatTasksContext } from '../../utils/contextFormatter.ts';
import { handleError } from '../../utils/errorHandler.ts';
import { fetchContextData, isEventQuestion, generateFallbackResponse } from './utils/contextUtils.ts';
import { generateAICompletion } from './openai/aiCompletionService.ts';
import { processFunctionCall } from './openai/functionCallHandler.ts';

// Main function to handle AI-powered question answering
export const handleAIQuestion = async (question: string): Promise<WhatsAppResponse> => {
  try {
    console.log('Processing AI question:', question);
    
    // First check database connection
    const connectionOk = await checkDatabaseConnection();
    if (!connectionOk) {
      return {
        type: 'text',
        message: "I'm having trouble connecting to our system. Please try again in a few moments."
      };
    }
    
    // Fetch all required data with timeouts
    const { events, contacts, documents, tasks } = await fetchContextData();
    
    console.log(`Context data loaded: events=${events.length}, contacts=${contacts.length}, documents=${documents.length}, tasks=${tasks.length}`);
    
    if (events.length === 0 && contacts.length === 0 && documents.length === 0 && tasks.length === 0) {
      // If all data fetching failed, return a connection error
      return {
        type: 'text',
        message: "I'm having trouble accessing our database right now. Please try again shortly."
      };
    }
    
    // Check if we have no events but the question is about events
    if (isEventQuestion(question) && events.length === 0) {
      return {
        type: 'text',
        message: "Currently, there are no events found in the system. If you need assistance with creating an event or anything else, feel free to ask."
      };
    }
    
    // Format the context data for each entity type
    const eventsContext = formatEventsContext(events);
    const contactsContext = formatContactsContext(contacts);
    const documentsContext = formatDocumentsContext(documents);
    const tasksContext = formatTasksContext(tasks);
    
    // Get system message for AI
    const systemMessage = getSystemMessage(
      eventsContext,
      contactsContext,
      documentsContext,
      "", // No PDF content in WhatsApp context
      tasksContext
    );
    
    console.log('System message length:', systemMessage.length);
    
    // Generate AI completion
    try {
      const completion = await generateAICompletion(question, systemMessage);
      
      // Handle function calls if any
      const functionCall = completion.choices[0]?.message?.function_call;
      let answer = completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't process your question. Please try again.";
      
      if (functionCall) {
        answer = await processFunctionCall(functionCall);
      }
      
      return {
        type: 'text',
        message: answer
      };
    } catch (error) {
      console.error('Error with primary model, falling back to simpler response:', error);
      return generateFallbackResponse(question);
    }
  } catch (error) {
    console.error('Error handling AI question:', error);
    return handleTimeoutError(error);
  }
};

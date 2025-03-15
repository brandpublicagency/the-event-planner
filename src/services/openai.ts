
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Timeout duration for OpenAI requests
const OPENAI_TIMEOUT = 30000; // 30 seconds

/**
 * Fetches a chat completion from OpenAI with improved error handling and logging
 */
export const getChatCompletion = async (messages: ChatCompletionMessageParam[]) => {
  console.log(`Sending request to OpenAI with ${messages.length} messages`);
  
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => {
        reject(new Error("OpenAI request timed out"));
      }, OPENAI_TIMEOUT);
    });

    // Track start time for performance metrics
    const startTime = performance.now();
    
    // Make the actual API request
    const completionPromise = openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini", // Using the mini model for faster responses
      temperature: 0.5,
      max_tokens: 1500,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      function_call: "auto",
      functions: [
        {
          name: "update_event",
          description: "Update an event's details in the system",
          parameters: {
            type: "object",
            properties: {
              event_code: {
                type: "string",
                description: "The unique code identifying the event"
              },
              updates: {
                type: "object",
                description: "The fields to update in the event",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  event_type: { type: "string" },
                  event_date: { type: "string" },
                  start_time: { type: "string" },
                  end_time: { type: "string" },
                  pax: { type: "number" },
                  venues: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Valid values are: The Kitchen, The Gallery, The Grand Hall, Package 1, Package 2, Package 3"
                  },
                  primary_name: { type: "string" },
                  primary_phone: { type: "string" },
                  primary_email: { type: "string" },
                  secondary_name: { type: "string" },
                  secondary_phone: { type: "string" },
                  secondary_email: { type: "string" },
                  address: { type: "string" },
                  company: { type: "string" },
                  vat_number: { type: "string" },
                }
              }
            },
            required: ["event_code", "updates"]
          }
        },
        {
          name: "update_menu",
          description: "Update a menu for an event",
          parameters: {
            type: "object",
            properties: {
              event_code: {
                type: "string",
                description: "The unique code identifying the event"
              },
              menu_updates: {
                type: "object",
                description: "The menu fields to update"
              }
            },
            required: ["event_code", "menu_updates"]
          }
        },
        {
          name: "create_task",
          description: "Create a new task in the system",
          parameters: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "The title of the task"
              },
              description: {
                type: "string",
                description: "The description of the task"
              },
              due_date: {
                type: "string",
                description: "The due date of the task in YYYY-MM-DD format"
              },
              priority: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "The priority of the task"
              },
              event_code: {
                type: "string",
                description: "The event code this task is associated with, if any"
              }
            },
            required: ["title"]
          }
        }
      ]
    });

    // Race the completion against the timeout
    const completion = await Promise.race([
      completionPromise,
      timeoutPromise.then(() => { throw new Error("OpenAI request timed out"); })
    ]);

    // Log performance metrics
    const endTime = performance.now();
    console.log(`OpenAI response received in ${Math.round(endTime - startTime)}ms`);

    // Handle function calls in the response
    const functionCall = completion.choices[0]?.message?.function_call;
    if (functionCall) {
      console.log('Function call detected:', functionCall.name);
      
      try {
        // Process function call based on type
        if (functionCall.name === 'update_event') {
          const args = JSON.parse(functionCall.arguments || '{}');
          console.log('Update event arguments:', args);
          
          // Ensure event_code and updates exist
          const eventCode = args.event_code;
          let updates = args.updates;
          
          // Handle venue specifically - ensure it's an array
          if (updates && updates.venues) {
            if (!Array.isArray(updates.venues)) {
              updates.venues = [updates.venues];
              console.log('Converted venues to array:', updates.venues);
            }
          }
          
          return `I'll update the event ${eventCode} with the following changes: ${JSON.stringify(updates)}.\n\n{"action":"update_event","event_code":"${eventCode}","updates":${JSON.stringify(updates)}}`;
        }
        
        if (functionCall.name === 'update_menu') {
          const args = JSON.parse(functionCall.arguments || '{}');
          return `I'll update the menu for event ${args.event_code} with the following changes: ${JSON.stringify(args.menu_updates)}.\n\n{"action":"update_menu","event_code":"${args.event_code}","menu_updates":${JSON.stringify(args.menu_updates)}}`;
        }
        
        if (functionCall.name === 'create_task') {
          const args = JSON.parse(functionCall.arguments || '{}');
          return `I'll create a new task: "${args.title}".\n\n{"action":"create_task","task_data":${JSON.stringify(args)}}`;
        }
      } catch (error) {
        console.error('Error processing function call:', error);
        return `I encountered an error while trying to process that request. Please try again with more specific instructions.`;
      }
    }

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error getting OpenAI completion:', error);
    throw error;
  }
};

/**
 * Prepares messages for the OpenAI API with proper formatting
 */
export const prepareOpenAIMessages = (
  systemMessage: string,
  chatMessages: { text: string; isUser: boolean }[],
  currentInput: string
): ChatCompletionMessageParam[] => {
  // Create system message
  const systemMessageObj: ChatCompletionMessageParam = {
    role: "system",
    content: systemMessage
  };

  // Convert chat history to OpenAI format
  const historyMessages: ChatCompletionMessageParam[] = chatMessages.map(msg => ({
    role: msg.isUser ? "user" : "assistant",
    content: msg.text
  }));

  // Add current user input
  const currentMessage: ChatCompletionMessageParam = {
    role: "user",
    content: currentInput
  };

  // Return complete message array
  return [systemMessageObj, ...historyMessages, currentMessage];
};

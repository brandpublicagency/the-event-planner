
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatCompletion = async (messages: ChatCompletionMessageParam[]) => {
  console.log(`Sending request to OpenAI with ${messages.length} messages`);
  
  // Find the system message to log its length (for debugging)
  const systemMessage = messages.find(msg => msg.role === 'system');
  if (systemMessage && typeof systemMessage.content === 'string') {
    console.log(`System message length: ${systemMessage.content.length} characters`);
  }
  
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini", // Using more capable model
      temperature: 0.5,     // Lower temperature for more factual responses
      max_tokens: 1200,     // Increased token limit for more detailed responses
      presence_penalty: 0.4,
      frequency_penalty: 0.3,
      function_call: "auto",  // Allow the model to decide when to call functions
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
        }
      ]
    });

    console.log('OpenAI response received', {
      usage: completion.usage,
      model: completion.model,
      finishReason: completion.choices[0]?.finish_reason
    });

    // Check if there's a function call in the response
    const functionCall = completion.choices[0]?.message?.function_call;
    if (functionCall) {
      console.log('Function call detected:', functionCall.name);
      
      // Process function call and return formatted response
      if (functionCall.name === 'update_event') {
        try {
          const args = JSON.parse(functionCall.arguments || '{}');
          console.log('Update event arguments:', args);
          
          // Ensure we don't have nested updates
          const eventCode = args.event_code;
          
          // Ensure updates is flat and correctly formatted
          let updates = args.updates;
          
          // Handle venue specifically - make sure it's an array
          if (updates && updates.venues) {
            if (!Array.isArray(updates.venues)) {
              if (typeof updates.venues === 'string') {
                updates.venues = [updates.venues];
                console.log('Converted venues string to array:', updates.venues);
              }
            }
          }
          
          // Return a properly formatted action string
          return `I'll update the event ${eventCode} with the following changes: ${JSON.stringify(updates)}.\n\n{"action":"update_event","event_code":"${eventCode}","updates":${JSON.stringify(updates)}}`;
        } catch (error) {
          console.error('Error parsing function arguments:', error);
          return `I encountered an error while trying to update the event. Please try again with more specific instructions.`;
        }
      }
      
      if (functionCall.name === 'update_menu') {
        try {
          const args = JSON.parse(functionCall.arguments || '{}');
          return `I'll update the menu for event ${args.event_code} with the following changes: ${JSON.stringify(args.menu_updates)}.\n\n{"action":"update_menu","event_code":"${args.event_code}","menu_updates":${JSON.stringify(args.menu_updates)}}`;
        } catch (error) {
          console.error('Error parsing function arguments:', error);
          return `I encountered an error while trying to update the menu. Please try again with more specific instructions.`;
        }
      }
    }

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw error;
  }
};

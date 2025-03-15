import { supabase } from "@/integrations/supabase/client";

export type StreamProcessor = {
  onContent: (content: string) => void;
  onFunctionCall: (functionCall: { name: string; arguments: string }) => void;
  onError: (error: string) => void;
  onComplete: () => void;
}

/**
 * Streams a chat completion from the edge function
 */
export const streamChatCompletion = async (
  messages: any[],
  systemMessage: string,
  processor: StreamProcessor,
  functionDefs?: any[]
) => {
  try {
    console.log(`Streaming chat completion with ${messages.length} messages`);
    
    // Call our edge function
    const { data, error } = await supabase.functions.invoke("chat-stream", {
      body: { messages, systemMessage, functionDefs }
    });

    if (error) {
      console.error('Error calling chat-stream edge function:', error);
      processor.onError(`Error streaming response: ${error.message}`);
      return;
    }

    if (!data) {
      processor.onError("No data received from streaming endpoint");
      return;
    }

    // Process the response data
    if (data.content) {
      processor.onContent(data.content);
    }
    
    if (data.function_call) {
      processor.onFunctionCall(data.function_call);
    }
    
    processor.onComplete();
  } catch (error) {
    console.error('Error in streamChatCompletion:', error);
    processor.onError(`Streaming error: ${error.message}`);
  }
};

/**
 * Get available function definitions for the chat
 */
export const getChatFunctionDefinitions = () => {
  return [
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
                description: "Valid values are: The Kitchen, The Gallery, The Grand Hall, The Lawn, The Avenue, Package 1, Package 2, Package 3"
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
  ];
};

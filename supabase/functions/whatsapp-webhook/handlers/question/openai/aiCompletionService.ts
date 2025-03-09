
import OpenAI from "https://esm.sh/openai@4.28.0";
import { withTimeout } from '../../../utils/timeoutUtils.ts';

// Create OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

// Helper function to generate AI completion
export async function generateAICompletion(question: string, systemMessage: string) {
  console.log('Generating AI completion with system message length:', systemMessage.length);
  
  return await withTimeout(
    openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Updated to use a more reliable model
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: question }
      ],
      temperature: 0.5,
      max_tokens: 800,
      function_call: "auto",
      functions: getFunctionDefinitions()
    }),
    "OpenAI completion",
    25000
  );
}

// Helper function to get function definitions for OpenAI
function getFunctionDefinitions() {
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
  ];
}

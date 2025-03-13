
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

// Create OpenAI client with timeout
export async function generateAICompletion(question: string, systemMessage: string) {
  console.log('Generating AI completion for question:', question);
  
  // Limit the completion to 30 seconds to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY")!,
    });
    
    // Create messages array with system and user message
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: question }
    ];
    
    // Call the API with the timeout signal
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using more capable model
      messages,
      temperature: 0.5,
      max_tokens: 1200,
      presence_penalty: 0.4,
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
                description: "The menu fields to update",
                properties: {
                  is_custom: { 
                    type: "boolean", 
                    description: "Whether this is a custom menu"
                  },
                  custom_menu_details: { 
                    type: "string", 
                    description: "Details for custom menu"
                  },
                  starter_type: { 
                    type: "string", 
                    description: "Type of starter (canapes, plated, harvest_table)"
                  },
                  canape_package: { 
                    type: "string", 
                    description: "Canape package selection"
                  },
                  canape_selections: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of selected canapes"
                  },
                  plated_starter: { 
                    type: "string", 
                    description: "Plated starter selection"
                  },
                  main_course_type: { 
                    type: "string", 
                    description: "Type of main course (buffet, plated, karoo)"
                  },
                  buffet_meat_selections: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of buffet meat selections"
                  },
                  buffet_vegetable_selections: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of buffet vegetable selections"
                  },
                  buffet_starch_selections: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of buffet starch selections"
                  },
                  buffet_salad_selection: { 
                    type: "string", 
                    description: "Buffet salad selection"
                  },
                  karoo_meat_selection: { 
                    type: "string", 
                    description: "Karoo meat selection"
                  },
                  karoo_starch_selection: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of karoo starch selections"
                  },
                  karoo_vegetable_selections: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of karoo vegetable selections"
                  },
                  karoo_salad_selection: { 
                    type: "string", 
                    description: "Karoo salad selection"
                  },
                  plated_main_selection: { 
                    type: "string", 
                    description: "Plated main course selection"
                  },
                  plated_salad_selection: { 
                    type: "string", 
                    description: "Plated salad selection"
                  },
                  dessert_type: { 
                    type: "string", 
                    description: "Type of dessert (traditional, dessert_bar, dessert_canapes, individual_cakes)"
                  },
                  traditional_dessert: { 
                    type: "string", 
                    description: "Traditional dessert selection"
                  },
                  dessert_canapes: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of dessert canape selections"
                  },
                  individual_cakes: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of individual cake selections"
                  },
                  notes: { 
                    type: "string", 
                    description: "Additional notes for the menu"
                  }
                }
              }
            },
            required: ["event_code", "menu_updates"]
          }
        }
      ]
    }, {
      signal: controller.signal,
    });
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    console.log('AI completion generated successfully', {
      model: completion.model,
      finish_reason: completion.choices[0]?.finish_reason
    });
    
    return completion;
  } catch (error) {
    // Clear the timeout in case of error
    clearTimeout(timeoutId);
    
    // Check if this was a timeout or abort error
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('AI completion request timed out after 30 seconds');
      throw new Error('Timeout error: OpenAI request took too long');
    }
    
    console.error('Error generating AI completion:', error);
    throw error;
  }
}

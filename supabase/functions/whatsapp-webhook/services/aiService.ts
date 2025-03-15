
import OpenAI from "https://esm.sh/openai@4.28.0";
import { withTimeout } from '../utils/timeoutUtils.ts';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

export const generateCompletion = async (systemPrompt: string, userQuestion: string) => {
  console.log('Generating AI completion with GPT-4o');
  
  try {
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o", // Using GPT-4o for better understanding
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userQuestion
          }
        ],
        max_tokens: 1000, // Increased tokens for more detailed responses
        temperature: 0.5,
        function_call: "auto",
        functions: [
          {
            name: "update_menu",
            description: "Update a menu selection for an event",
            parameters: {
              type: "object",
              properties: {
                event_code: {
                  type: "string",
                  description: "The unique code identifying the event"
                },
                menu_updates: {
                  type: "object",
                  description: "The menu details to update",
                  properties: {
                    starter_type: { type: "string" },
                    main_course_type: { type: "string" },
                    dessert_type: { type: "string" },
                    is_custom: { type: "boolean" },
                    custom_menu_details: { type: "string" },
                    canape_package: { type: "string" },
                    canape_selections: { 
                      type: "array",
                      items: { type: "string" }
                    },
                    notes: { type: "string" }
                  }
                }
              },
              required: ["event_code", "menu_updates"]
            }
          }
        ]
      }),
      'AI completion'
    );

    // Check for function call
    if (completion.choices[0]?.message?.function_call) {
      const functionCall = completion.choices[0].message.function_call;
      console.log('Function call detected:', functionCall.name);
      
      if (functionCall.name === 'update_menu') {
        try {
          const args = JSON.parse(functionCall.arguments || '{}');
          return `I'll update the menu for event ${args.event_code} with the following changes: ${JSON.stringify(args.menu_updates)}.\n\n{"action":"update_menu","event_code":"${args.event_code}","menu_updates":${JSON.stringify(args.menu_updates)}}`;
        } catch (error) {
          console.error('Error parsing function call arguments:', error);
          return "I couldn't parse the menu update information. Please try again with specific changes you'd like to make.";
        }
      }
    }

    const answer = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
    console.log('Generated AI response:', answer);
    
    return answer;
  } catch (error) {
    console.error('Error generating AI completion:', error);
    throw error;
  }
};

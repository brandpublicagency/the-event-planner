
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
        model: "gpt-4o", // Upgraded to GPT-4o from gpt-4o-mini
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
        temperature: 0.5
      }),
      'AI completion'
    );

    const answer = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
    console.log('Generated AI response:', answer);
    
    return answer;
  } catch (error) {
    console.error('Error generating AI completion:', error);
    throw error;
  }
};

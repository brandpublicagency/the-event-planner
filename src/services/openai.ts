
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatCompletion = async (messages: ChatCompletionMessageParam[]) => {
  console.log(`Sending request to OpenAI with ${messages.length} messages`);
  
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o-mini", // Using more capable model
      temperature: 0.7,
      max_tokens: 1000,    // Increased token limit for more detailed responses
      presence_penalty: 0.6,
      frequency_penalty: 0.2
    });

    console.log('OpenAI response received', {
      usage: completion.usage,
      model: completion.model,
      finishReason: completion.choices[0]?.finish_reason
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw error;
  }
};

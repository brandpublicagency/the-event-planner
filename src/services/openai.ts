import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatCompletion = async (messages: ChatCompletionMessageParam[]) => {
  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 500,
    presence_penalty: 0.6,
    frequency_penalty: 0.2
  });

  return completion.choices[0]?.message?.content || null;
};
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  timeout: 30000
});

export const getChatCompletion = async (messages: ChatCompletionMessageParam[]) => {
  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-4",
    max_tokens: 500
  });

  return completion.choices[0]?.message?.content;
};
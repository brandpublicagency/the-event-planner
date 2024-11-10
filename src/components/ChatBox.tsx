import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import OpenAI from "openai";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

console.log("ChatBox: OpenAI client initialization status:", !!openai);

const ChatBox = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch PDF content
  const { data: pdfContents } = useQuery({
    queryKey: ['pdf-contents'],
    queryFn: async () => {
      console.log("Fetching PDF contents from Supabase...");
      const { data, error } = await supabase
        .from('pdf_processed_content')
        .select('content')
        .not('content', 'is', null);
      
      if (error) {
        console.error("Error fetching PDF contents:", error);
        throw error;
      }
      console.log("PDF contents fetched successfully:", data?.length, "documents");
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      toast({
        title: "Error",
        description: "OpenAI API key not configured",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const newMessages = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare context from PDF contents
      const pdfContext = pdfContents
        ?.map(doc => doc.content)
        .filter(Boolean)
        .join('\n\n');

      console.log("Sending request to OpenAI with model: gpt-4o-mini");
      
      const systemMessage: ChatCompletionMessageParam = {
        role: "system",
        content: `You are an expert event planning assistant for internal coordinators. Your role is to help with:

1. Event Planning:
   - Suggest timelines and checklists for different event types
   - Provide vendor coordination tips
   - Help with budget allocation and management
   - Recommend setup and logistics arrangements

2. Event Execution:
   - Share best practices for day-of coordination
   - Provide contingency planning advice
   - Suggest solutions for common event challenges
   - Help with staff and volunteer management

3. Optimization:
   - Recommend ways to improve event flow
   - Suggest cost-saving measures
   - Share insights from similar past events
   - Provide tips for better guest experience

Use this context from our internal documents to provide specific advice:
${pdfContext || 'No additional context available.'}`
      };

      const userMessages: ChatCompletionMessageParam[] = newMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));

      const completion = await openai.chat.completions.create({
        messages: [systemMessage, ...userMessages],
        model: "gpt-4o-mini",
      });

      console.log("Received response from OpenAI:", completion.choices[0]?.message);
      const botResponse = completion.choices[0]?.message?.content;
      if (botResponse) {
        setMessages([...newMessages, { text: botResponse, isUser: false }]);
      }
    } catch (error: any) {
      console.error('Error getting response from OpenAI:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative h-[450px]">
      <div 
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6)",
          padding: "1px",
        }}
      >
        <Card className="h-full w-full flex flex-col bg-background rounded-3xl">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-3xl px-4 py-2 max-w-[80%] border ${
                      message.isUser
                        ? "border-purple-500 text-purple-800 bg-white"
                        : "border-gray-300 text-gray-800 bg-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 rounded-3xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoComplete="off"
                disabled={isLoading}
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity rounded-3xl px-6 text-white hover:text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChatBox;
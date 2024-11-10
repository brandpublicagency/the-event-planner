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

const ChatBox = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch PDF content
  const { data: pdfContents } = useQuery({
    queryKey: ['pdf-contents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pdf_processed_content')
        .select('content')
        .not('content', 'is', null);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch upcoming events
  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          wedding_details (*),
          corporate_details (*),
          event_venues (
            venues (
              name
            )
          )
        `)
        .gte('event_date', today)
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Error",
        description: "OpenAI API key not configured",
        variant: "destructive",
      });
      return;
    }

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

      // Prepare context from upcoming events
      const eventsContext = upcomingEvents?.map(event => {
        const venue = event.event_venues?.[0]?.venues?.name || 'No venue specified';
        const date = new Date(event.event_date).toLocaleDateString();
        
        let details = '';
        if (event.wedding_details) {
          details = `Wedding: ${event.wedding_details.bride_name} & ${event.wedding_details.groom_name}`;
        } else if (event.corporate_details) {
          details = `Corporate: ${event.corporate_details.company_name}`;
        }

        return `Event: ${event.name} (${event.event_type})
Date: ${date}
Venue: ${venue}
Details: ${details}
Pax: ${event.pax}
`;
      }).join('\n\n');

      const systemMessage: ChatCompletionMessageParam = {
        role: "system",
        content: `You are an expert event planning assistant with access to the following information:

1. Upcoming Events:
${eventsContext || 'No upcoming events found.'}

2. Event Planning Guidelines:
${pdfContext || 'No additional guidelines available.'}

Your role is to help with:
1. Event Planning & Management
2. Schedule Coordination
3. Venue Information
4. Client Details
5. Best Practices & Guidelines

Please use this information to provide accurate and contextual responses about events, schedules, and planning details.`
      };

      const userMessages: ChatCompletionMessageParam[] = newMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));

      const completion = await openai.chat.completions.create({
        messages: [systemMessage, ...userMessages],
        model: "gpt-4o-mini",
      });

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

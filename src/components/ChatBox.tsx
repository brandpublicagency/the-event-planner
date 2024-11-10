import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import OpenAI from "openai";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const ChatBox = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const sendEmail = async (to: string[], subject: string, content: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html: content }
      });

      if (error) throw error;
      
      toast({
        title: "Email sent successfully",
        description: "The email has been sent to the specified recipients.",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
      throw error;
    }
  };

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

        return `Event: ${event.name} (${event.event_type})\nDate: ${date}\nVenue: ${venue}\nDetails: ${details}\nPax: ${event.pax}\n`;
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

Please use this information to provide accurate and contextual responses about events, schedules, and planning details.

You can also send emails to clients when needed. To send an email, respond with a JSON object in this format:
{
  "action": "send_email",
  "to": ["recipient@email.com"],
  "subject": "Email subject",
  "content": "Email content in HTML format"
}`
      };

      const userMessages: ChatCompletionMessageParam[] = newMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));

      const completion = await openai.chat.completions.create({
        messages: [systemMessage, ...userMessages],
        model: "gpt-4",
      });

      const botResponse = completion.choices[0]?.message?.content;
      if (botResponse) {
        try {
          // Check if the response is a JSON object with an email action
          const jsonResponse = JSON.parse(botResponse);
          if (jsonResponse.action === "send_email") {
            await sendEmail(jsonResponse.to, jsonResponse.subject, jsonResponse.content);
            setMessages([
              ...newMessages,
              { text: "Email sent successfully!", isUser: false }
            ]);
          } else {
            setMessages([...newMessages, { text: botResponse, isUser: false }]);
          }
        } catch {
          // If it's not a JSON object, treat it as a regular message
          setMessages([...newMessages, { text: botResponse, isUser: false }]);
        }
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
                <ChatMessage key={index} {...message} />
              ))}
            </div>
          </ScrollArea>
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChatBox;

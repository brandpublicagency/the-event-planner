import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import { useChatContext } from "@/hooks/useChatContext";
import { getChatCompletion } from "@/services/openai";
import { sendEmail } from "@/services/email";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const ChatBox = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: contextData, isLoading: isContextLoading } = useChatContext();

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
      // Prepare context from data
      const eventsContext = contextData?.events?.map(event => {
        const venue = event.event_venues?.[0]?.venues?.name || 'No venue specified';
        const date = new Date(event.event_date).toLocaleDateString();
        
        let details = '';
        if (event.wedding_details) {
          details = `Wedding: ${event.wedding_details.bride_name} & ${event.wedding_details.groom_name}`;
        } else if (event.corporate_details) {
          details = `Corporate: ${event.corporate_details.company_name}`;
        }

        const menuInfo = event.menu_selections 
          ? `Menu: ${event.menu_selections.is_custom ? 'Custom Menu' : `${event.menu_selections.starter_type || ''} ${event.menu_selections.plated_starter || ''}`}`
          : 'No menu selected';

        return `Event: ${event.name} (${event.event_type})
Date: ${date}
Venue: ${venue}
Details: ${details}
${menuInfo}
Pax: ${event.pax}`;
      }).join('\n\n');

      const pdfContext = contextData?.pdfContent?.map(pdf => 
        `Document Content: ${pdf.content}`
      ).join('\n\n');

      const systemMessage: ChatCompletionMessageParam = {
        role: "system",
        content: `You are an expert event planning assistant with access to the following information:

1. Upcoming Events:
${eventsContext || 'No upcoming events found.'}

2. Document Knowledge Base:
${pdfContext || 'No documents available.'}

Your role is to help with:
1. Event Planning & Management
2. Schedule Coordination
3. Venue Information
4. Client Details
5. Menu Planning and Selection
6. Best Practices & Guidelines

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

      const botResponse = await getChatCompletion([systemMessage, ...userMessages]);

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
            isLoading={isLoading || isContextLoading}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChatBox;
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import OpenAI from "openai";
import { mockEvents } from "@/data/mockEvents";

const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateEventsContext = () => {
    return mockEvents.map(event => `
      Event Code: ${event.event_code}
      Event: ${event.title}
      Type: ${event.event_type}
      Date: ${new Date(event.dueDate).toLocaleDateString()}
      Status: ${event.status}
      Progress: ${event.progress}%
      Team Size: ${event.teamSize} members
      Venue: ${event.venues.map(v => v.name).join(', ')}
      Guest Count: ${event.pax || 'TBC'}
      ${event.event_type === 'Wedding' ? `
      Bride Name: ${event.bride_name || 'N/A'}
      Bride Email: ${event.bride_email || 'N/A'}
      Groom Name: ${event.groom_name || 'N/A'}
      Groom Email: ${event.groom_email || 'N/A'}
      Client Address: ${event.client_address || 'N/A'}
      ` : ''}
      Description: ${event.description}
    `).join('\n\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !openai) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const eventsContext = generateEventsContext();
      
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful event planning assistant. You have access to the following events information:
            
            ${eventsContext}
            
            Use this information to answer questions about events, schedules, venues, client details, and team assignments. Keep your responses concise, professional, and focused on the event planning context. If you don't have specific information about something, acknowledge that and suggest what information might be needed.`
          },
          ...messages,
          userMessage
        ],
        model: "gpt-4o-mini",
      });

      const assistantMessage = {
        role: "assistant" as const,
        content: completion.choices[0]?.message?.content || "I apologize, but I couldn't process your request."
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 flex flex-col h-[400px] relative border-gradient">
      <div className="absolute inset-0 rounded-lg border-gradient-mask"></div>
      <div className="z-10 flex-1 flex flex-col">
        <h3 className="font-semibold mb-4">Chat Assistant</h3>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about upcoming events..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatBox;
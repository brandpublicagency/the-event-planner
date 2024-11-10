import { useState } from "react";
import OpenAI from "openai";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

type Message = {
  text: string;
  isUser: boolean;
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = { text: newMessage, isUser: true };
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system" as const,
            content: "You are a helpful event planning assistant. Provide concise and relevant responses to help users plan their events."
          },
          ...messages.map(msg => ({
            role: msg.isUser ? ("user" as const) : ("assistant" as const),
            content: msg.text
          }))
        ],
        model: "gpt-3.5-turbo",
      });

      const assistantMessage: Message = {
        text: completion.choices[0]?.message?.content || "Sorry, I couldn't process that.",
        isUser: false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
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
    <div className="flex flex-col h-[450px] w-full max-w-2xl mx-auto border-gradient rounded-lg overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-zinc-100 text-zinc-900"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-200">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="bg-white border-zinc-200"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
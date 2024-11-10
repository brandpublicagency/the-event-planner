import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import OpenAI from "openai";
import { useToast } from "@/components/ui/use-toast";

const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;

const ChatBox = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!openai) {
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
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a friendly event planning assistant. Help users plan and organize their events effectively."
          },
          ...newMessages.map(msg => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.text
          }))
        ],
        model: "gpt-4o-mini",
      });

      const botResponse = completion.choices[0]?.message?.content;
      if (botResponse) {
        setMessages([...newMessages, { text: botResponse, isUser: false }]);
      }
    } catch (error: any) {
      console.error('Error getting response:', error);
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
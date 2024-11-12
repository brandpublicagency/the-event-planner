import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import { useChatContext } from "@/hooks/useChatContext";
import { getChatCompletion } from "@/services/openai";
import { sendEmail } from "@/services/email";
import { updateMenuSelection } from "@/services/menuService";
import { prepareEventsContext, getSystemMessage } from "@/utils/chatContextUtils";
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
      const eventsContext = prepareEventsContext(contextData?.events);
      const pdfContext = contextData?.pdfContent?.map(pdf => 
        `Document Content: ${pdf.content}`
      ).join('\n\n');

      const systemMessage = getSystemMessage(eventsContext, pdfContext);
      const userMessages: ChatCompletionMessageParam[] = newMessages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
        name: undefined
      }));

      const botResponse = await getChatCompletion([systemMessage, ...userMessages]);

      if (botResponse) {
        try {
          const jsonResponse = JSON.parse(botResponse);
          
          if (jsonResponse.action === "update_menu") {
            // Ensure canape_selections is always an array or null
            const menuUpdates = {
              ...jsonResponse.menu_updates,
              canape_selections: Array.isArray(jsonResponse.menu_updates.canape_selections) 
                ? jsonResponse.menu_updates.canape_selections 
                : null
            };
            
            await updateMenuSelection(jsonResponse.event_code, menuUpdates);
            setMessages([...newMessages, { text: "Menu updated successfully!", isUser: false }]);
            
            toast({
              title: "Success",
              description: "Menu has been updated",
            });
          } else if (jsonResponse.action === "send_email") {
            await sendEmail(jsonResponse.to, jsonResponse.subject, jsonResponse.content);
            setMessages([
              ...newMessages,
              { text: "Email sent successfully!", isUser: false }
            ]);
          } else {
            setMessages([...newMessages, { text: botResponse, isUser: false }]);
          }
        } catch {
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
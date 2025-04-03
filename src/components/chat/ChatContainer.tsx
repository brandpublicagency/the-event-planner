
import { Card } from "@/components/ui/card";
import { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { ChatMessage } from "@/types/chat";

const ChatContainer = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) {
      return;
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    // Simple echo response implementation (replacing AI functionality)
    setTimeout(() => {
      const systemResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "This is a placeholder response. The AI functionality has been removed.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemResponse]);
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="relative h-full">
      <Card className="h-full w-full flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white">
        <ChatHeader hasData={true} isMinimized={messages.length > 0} />
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm text-gray-500 mb-8 max-w-xs">
              This is a simplified chat interface. The AI assistant functionality has been removed.
            </p>
          </div>
        ) : (
          <ChatMessageList messages={messages} isLoading={isLoading} />
        )}
        
        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholderText="Type your message..."
        />
      </Card>
    </div>
  );
};

export default ChatContainer;


import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatMessageList = ({ messages, isLoading }: ChatMessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && shouldAutoScroll) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        });
      }
    }
  }, [messages, shouldAutoScroll, isLoading]);

  // Handle scroll events to determine if auto-scroll should be enabled
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 100;
    setShouldAutoScroll(isNearBottom);
  };

  return (
    <ScrollArea 
      className="flex-1 p-4 h-full min-h-0" 
      ref={scrollAreaRef} 
      onScroll={handleScroll}
    >
      <div className="space-y-4 pb-2">
        {messages.map((message, index) => (
          <div 
            key={`${message.id || index}-${message.text.substring(0, 10)}`} 
            className="transition-all duration-300 ease-in-out"
          >
            <ChatMessage {...message} />
          </div>
        ))}
        
        {isLoading && !messages.some(msg => 
          msg.text === "Thinking..." || 
          msg.text === "Processing..." || 
          msg.text.includes("Retrying...")
        ) && (
          <div className="flex justify-start animate-pulse">
            <div className="px-4 py-2 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;

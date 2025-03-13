
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import { ChatMessageHandler } from "./ChatMessageHandler";
import { useEffect, useRef, useState } from "react";

const ChatContainer = () => {
  const {
    messages: chatMessages,
    inputValue,
    isLoading,
    setInputValue,
    clearInput
  } = useChatState();
  
  const {
    data: contextData
  } = useChatContext();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && shouldAutoScroll) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        setTimeout(() => {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }, 100);
      }
    }
  }, [chatMessages, shouldAutoScroll, isLoading]);

  // Handle scroll events to determine if auto-scroll should be enabled
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 100;
    setShouldAutoScroll(isNearBottom);
  };

  return (
    <div className="relative h-[300px]">
      <Card className="chat-container h-full w-full flex flex-col rounded-2xl">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} onScroll={handleScroll}>
          <div className="space-y-4 pb-2">
            {chatMessages.map((message, index) => (
              <div 
                key={`${index}-${message.text.substring(0, 10)}`} 
                className="transition-all duration-300 ease-in-out"
              >
                <ChatMessage {...message} />
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="px-4 py-2 rounded-[10px] border border-gray-300 bg-gray-100">
                  Typing...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <ChatMessageHandler 
          contextData={contextData} 
          inputValue={inputValue} 
          isLoading={isLoading} 
          setInputValue={setInputValue} 
          clearInput={clearInput} 
        />
      </Card>
      
      <style>
        {`
        .chat-container {
          position: relative;
          border: none !important;
          box-shadow: none !important;
          background: white;
          z-index: 1;
        }
        
        .chat-container::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px; /* Controls border thickness */
          border-radius: inherit;
          background: linear-gradient(90deg, 
            #ec4899, #8b5cf6, #3b82f6, #8b5cf6, #ec4899);
          background-size: 300% 100%;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: animatedgradient 15s ease infinite;
          pointer-events: none;
        }
        
        @keyframes animatedgradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        `}
      </style>
    </div>
  );
};

export default ChatContainer;


import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import { ChatMessageHandler } from "./ChatMessageHandler";
import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";

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
      <Card className="chat-container h-full w-full flex flex-col rounded-xl border-none shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 flex items-center gap-2 text-white">
          <MessageSquare size={18} />
          <h3 className="font-medium">Chat Assistant</h3>
        </div>
        
        <ScrollArea className="flex-1 p-4 bg-white/60 backdrop-blur-sm" ref={scrollAreaRef} onScroll={handleScroll}>
          <div className="space-y-4 pb-2">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-32 text-muted-foreground p-6">
                <MessageSquare className="h-10 w-10 mb-2 text-muted-foreground/50" />
                <p className="text-sm">Ask me anything about your events, tasks, or documents.</p>
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div 
                  key={`${index}-${message.text.substring(0, 10)}`} 
                  className="transition-all duration-300 ease-in-out"
                >
                  <ChatMessage {...message} />
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="px-4 py-2 rounded-xl border border-gray-300 bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
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
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08);
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
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        `}
      </style>
    </div>
  );
};

export default ChatContainer;

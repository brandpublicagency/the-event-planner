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
    console.log('Messages updated:', {
      messageCount: chatMessages.length,
      lastMessage: chatMessages[chatMessages.length - 1]?.text,
      isLoading
    });
    if (scrollAreaRef.current && shouldAutoScroll) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        console.log('Initiating scroll...');
        setTimeout(() => {
          scrollArea.scrollTop = scrollArea.scrollHeight;
          console.log('Scroll complete. New scroll position:', scrollArea.scrollTop);
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
  return <div className="relative h-[300px]">
      {/* Fallback border that will always be visible */}
      <Card className="h-full w-full flex flex-col border-1 border-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-white rounded-2xl">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef} onScroll={handleScroll}>
          <div className="space-y-4 pb-2">
            {chatMessages.map((message, index) => <div key={`${index}-${message.text.substring(0, 10)}`} className="transition-all duration-300 ease-in-out">
                <ChatMessage {...message} />
              </div>)}
            {isLoading && <div className="flex justify-start animate-pulse">
                <div className="px-4 py-2 rounded-[10px] border border-gray-300 bg-gray-100">
                  Typing...
                </div>
              </div>}
          </div>
        </ScrollArea>
        <ChatMessageHandler contextData={contextData} inputValue={inputValue} isLoading={isLoading} setInputValue={setInputValue} clearInput={clearInput} />
      </Card>
      
      {/* CSS-only animated border overlay */}
      <style jsx>{`
        .border-gradient-to-r {
          position: relative;
          z-index: 0;
          overflow: hidden;
        }
        
        .border-gradient-to-r::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 14px;
          padding: 2px;
          background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #8b5cf6, #ec4899);
          background-size: 300% 100%;
          -webkit-animation: animatedgradient 15s ease infinite;
          animation: animatedgradient 15s ease infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        @-webkit-keyframes animatedgradient {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        @keyframes animatedgradient {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>;
};
export default ChatContainer;
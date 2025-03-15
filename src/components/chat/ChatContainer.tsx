
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import ChatMessageHandler from "./ChatMessageHandler";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

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

  // Generate improved placeholder suggestions based on information types in the app
  const suggestions = [
    "What is my next event?",
    "Update the guest count for my next event to 50",
    "Change the venue for my next event to The Gallery",
    "Show me all my upcoming tasks",
    "What events do I have scheduled this month?",
    "Create a new task for my next event"
  ];

  return (
    <div className="relative h-[440px]">
      <Card className="h-full w-full flex flex-col rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-6 border-b border-gray-100">
              <Sparkles className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Ask our AI anything</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-8 max-w-xs">
                Ask me anything about your events, tasks, contacts, or documents. I have full access to all information and can make changes for you.
              </p>
              <div className="w-full">
                <p className="text-xs text-gray-400 mb-3">Try asking</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="text-sm p-2 bg-gray-50 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center p-3 border-b border-gray-100">
              <Sparkles className="h-4 w-4 text-gray-500 mr-2" />
              <h3 className="text-xs font-medium text-gray-700">AI Assistant</h3>
            </div>
            <ScrollArea className="flex-1 p-4 bg-white" ref={scrollAreaRef} onScroll={handleScroll}>
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
          </>
        )}
        
        <ChatMessageHandler 
          contextData={contextData} 
          inputValue={inputValue} 
          isLoading={isLoading} 
          setInputValue={setInputValue} 
          clearInput={clearInput} 
        />
      </Card>
    </div>
  );
};

export default ChatContainer;

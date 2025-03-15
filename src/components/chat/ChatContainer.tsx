
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import ChatMessageHandler from "./ChatMessageHandler";
import ChatInput from "./ChatInput";
import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const ChatContainer = () => {
  const {
    messages: chatMessages,
    inputValue,
    isLoading,
    setInputValue,
    clearInput
  } = useChatState();
  
  const {
    data: contextData,
    isLoading: isContextLoading,
    error: contextError,
    refetch: refetchContext
  } = useChatContext();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

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
  }, [chatMessages, shouldAutoScroll, isLoading]);

  // Handle scroll events to determine if auto-scroll should be enabled
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // Set initial load to false after component mount
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  // Generate personalized placeholder suggestions
  const suggestions = [
    "What events do I have scheduled this month?",
    "Create a new task for my next event",
    "Show me the guest list for EVENT-001",
    "Update the venue for my next event to The Gallery",
    "What's my next deadline?",
    "Show me all tasks for the Thompson wedding"
  ];

  // Handler for clicking on a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Focus the input field
    const inputElement = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  // Retry loading context data if there was an error
  const handleRetryContextLoad = () => {
    refetchContext();
  };

  return (
    <div className="relative h-[440px]">
      <Card className="h-full w-full flex flex-col rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Bot className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">DMOS Assistant</h3>
              </div>
              
              {contextData && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Full Access
                        </Badge>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        This assistant has full access to all events, contacts, tasks, and documents data.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {contextError ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Info className="h-6 w-6 text-red-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Unable to load context data. The assistant may have limited information available.
                  </p>
                  <button 
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    onClick={handleRetryContextLoad}
                  >
                    Retry Loading Data
                  </button>
                </div>
              ) : (
                <>
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
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <div className="flex items-center">
                <Bot className="h-4 w-4 text-gray-500 mr-2" />
                <h3 className="text-xs font-medium text-gray-700">DMOS Assistant</h3>
              </div>
              
              {contextData && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Full Access
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[200px]">
                        This assistant has full access to all events, contacts, tasks, and documents data.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <ScrollArea 
              className="flex-1 p-4 bg-white" 
              ref={scrollAreaRef} 
              onScroll={handleScroll}
            >
              <div className="space-y-4 pb-2">
                {chatMessages.map((message, index) => (
                  <div 
                    key={`${message.id || index}-${message.text.substring(0, 10)}`} 
                    className="transition-all duration-300 ease-in-out"
                  >
                    <ChatMessage {...message} />
                  </div>
                ))}
                
                {isLoading && !chatMessages.some(msg => 
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
          </>
        )}
        
        <ChatMessageHandler 
          contextData={contextData}
          inputValue={inputValue}
          isLoading={isLoading || isContextLoading}
          setInputValue={setInputValue}
          clearInput={clearInput}
        >
          {({ messages, isLoading: handlerIsLoading, pendingAction, handleSubmit }) => (
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleSubmit}
              isLoading={isLoading || handlerIsLoading || isContextLoading}
              placeholderText={pendingAction ? "Type 'yes' to confirm or 'no' to cancel..." : "Type your message..."}
            />
          )}
        </ChatMessageHandler>
      </Card>
    </div>
  );
};

export default ChatContainer;

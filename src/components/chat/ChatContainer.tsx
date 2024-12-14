import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import { ChatMessageHandler } from "./ChatMessageHandler";
import { useEffect, useRef } from "react";

const ChatContainer = () => {
  const {
    messages: chatMessages,
    inputValue,
    isLoading,
    setInputValue,
    clearInput,
  } = useChatState();

  const { data: contextData } = useChatContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        const shouldScroll = Math.abs(
          scrollArea.scrollHeight - scrollArea.clientHeight - scrollArea.scrollTop
        ) < 100;

        if (shouldScroll) {
          setTimeout(() => {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }, 100);
        }
      }
    }
  }, [chatMessages]);

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
          <ScrollArea 
            className="flex-1 p-4"
            ref={scrollAreaRef}
          >
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
                  <div className="rounded-3xl px-4 py-2 border border-gray-300 bg-gray-100">
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
      </div>
    </div>
  );
};

export default ChatContainer;
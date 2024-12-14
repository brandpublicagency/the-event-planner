import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import { ChatMessageHandler } from "./ChatMessageHandler";
import { useEffect, useRef, useLayoutEffect } from "react";

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
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Immediate scroll on new messages
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      if (scrollAreaRef.current) {
        const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollArea) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        }
      }
    });
  }, [chatMessages]);

  // Smooth scroll for better UX
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
                  key={index}
                  ref={index === chatMessages.length - 1 ? lastMessageRef : null}
                  className="transition-opacity duration-200 ease-in-out"
                  style={{ opacity: 1 }}
                >
                  <ChatMessage {...message} />
                </div>
              ))}
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
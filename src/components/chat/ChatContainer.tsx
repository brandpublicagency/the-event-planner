import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
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

  // Use useLayoutEffect to scroll before browser paint
  useLayoutEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [chatMessages]); // Dependency on chatMessages ensures scroll on new messages

  // Backup scroll effect for smooth scrolling to last message
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
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
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  ref={index === chatMessages.length - 1 ? lastMessageRef : null}
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
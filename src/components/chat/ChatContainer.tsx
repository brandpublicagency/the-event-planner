import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
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

  // Scroll to bottom when messages change or component mounts
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
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
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <ChatMessage key={index} {...message} />
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
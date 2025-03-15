import { useChatState } from "@/hooks/useChatState";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ChatConfirmation from "@/components/chat/ChatConfirmation";
import ChatMessageHandler from "@/components/chat/ChatMessageHandler";
import { useEffect, useRef, useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatHandlerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  pendingAction: any;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const Chat = () => {
  const { inputValue, setInputValue, clearInput } = useChatState();
  const [localInputValue, setLocalInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Keep local state in sync with global state
  useEffect(() => {
    setInputValue(localInputValue);
  }, [localInputValue, setInputValue]);

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg">
      <div className="p-3 border-b">
        <h2 className="text-base font-semibold">Event Assistant</h2>
        <p className="text-xs text-gray-500">Ask me about events, tasks, or menus</p>
      </div>
      
      <ChatMessageHandler>
        {({ messages, isLoading, pendingAction, handleSubmit }: ChatHandlerProps) => (
          <>
            <ScrollArea 
              className="flex-1 p-3" 
              ref={scrollAreaRef}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    text={message.text}
                    isUser={message.isUser}
                  />
                ))}
              </div>
            </ScrollArea>
            
            {pendingAction && (
              <ChatConfirmation 
                pendingAction={pendingAction} 
              />
            )}
            
            <ChatInput
              value={localInputValue}
              onChange={(e) => setLocalInputValue(e.target.value)}
              onSubmit={async (e) => {
                await handleSubmit(e);
                setLocalInputValue("");
              }}
              isLoading={isLoading}
            />
          </>
        )}
      </ChatMessageHandler>
    </div>
  );
};

export default Chat;


import { Card } from "@/components/ui/card";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import ChatMessageHandler from "./ChatMessageHandler";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatSuggestions from "./ChatSuggestions";
import ChatErrorState from "./ChatErrorState";
import ChatMessageList from "./ChatMessageList";
import { useChatSuggestions } from "./useChatSuggestions";

const ChatContainer = () => {
  const {
    messages: chatMessages,
    isLoading,
    clearInput
  } = useChatState();
  
  const {
    data: contextData,
    isLoading: isContextLoading,
    error: contextError,
    refetch: refetchContext
  } = useChatContext();
  
  const [initialLoad, setInitialLoad] = useState(true);
  const { suggestions, inputValue, setInputValue, handleSuggestionClick } = useChatSuggestions();

  // Set initial load to false after component mount
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  // Retry loading context data if there was an error
  const handleRetryContextLoad = () => {
    refetchContext();
  };

  return (
    <div className="relative h-full">
      <Card className="h-full w-full flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col h-full">
            <ChatHeader hasData={!!contextData} />
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              {contextError ? (
                <ChatErrorState onRetry={handleRetryContextLoad} />
              ) : (
                <ChatSuggestions 
                  suggestions={suggestions} 
                  onSuggestionClick={handleSuggestionClick} 
                />
              )}
            </div>
          </div>
        ) : (
          <>
            <ChatHeader hasData={!!contextData} isMinimized={true} />
            <ChatMessageList messages={chatMessages} isLoading={isLoading} />
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

import { Card } from "@/components/ui/card";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import ChatMessageHandler from "./ChatMessageHandler";
import ChatInput from "./ChatInput";
import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatErrorState from "./ChatErrorState";
import ChatMessageList from "./ChatMessageList";

const ChatContainer = () => {
  const {
    messages: chatMessages,
    isLoading,
    clearInput: stateResetInput,
    inputValue: stateInputValue,
    setInputValue: stateSetInputValue
  } = useChatState();
  
  const {
    data: contextData,
    isLoading: isContextLoading,
    error: contextError,
    refetch: refetchContext
  } = useChatContext();
  
  const [initialLoad, setInitialLoad] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // Set initial load to false after component mount
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  // Keep local state in sync with global state
  useEffect(() => {
    stateSetInputValue(inputValue);
  }, [inputValue, stateSetInputValue]);

  // Retry loading context data if there was an error
  const handleRetryContextLoad = () => {
    refetchContext();
  };

  const clearInput = () => {
    setInputValue("");
    stateResetInput();
  };

  return (
    <div className="relative h-full">
      <Card className="h-full w-full flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white">
        <ChatHeader hasData={!!contextData} isMinimized={chatMessages.length > 0} />
        
        {chatMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {contextError ? (
              <ChatErrorState onRetry={handleRetryContextLoad} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm text-gray-500 mb-8 max-w-xs">
                  Ask me anything about your events, tasks, contacts, or documents. I have full access to all information and can make changes for you.
                </p>
              </div>
            )}
          </div>
        ) : (
          <ChatMessageList messages={chatMessages} isLoading={isLoading} />
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

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import { useChatContext } from "@/hooks/useChatContext";
import { useChatState } from "@/hooks/useChatState";
import { handleConfirmation } from "./chat/ChatConfirmation";
import { getChatCompletion } from "@/services/openai";
import { prepareEventsContext, prepareTasksContext, getSystemMessage } from "@/utils/chatContextUtils";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { useTaskContext } from "@/contexts/TaskContext";

const TIMEOUT_DURATION = 45000;

const ChatBox = () => {
  const {
    messages: chatMessages,
    inputValue,
    isLoading,
    pendingAction,
    setInputValue,
    setIsLoading,
    setPendingAction,
    addUserMessage,
    addSystemMessage,
    clearInput,
    toast
  } = useChatState();

  const { data: contextData } = useChatContext() || {};
  const { tasks } = useTaskContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (pendingAction) {
      const isConfirmation = inputValue.toLowerCase().includes('yes') || 
                            inputValue.toLowerCase().includes('confirm') ||
                            inputValue.toLowerCase() === 'y';
      const isDenial = inputValue.toLowerCase().includes('no') || 
                      inputValue.toLowerCase().includes('cancel') ||
                      inputValue.toLowerCase() === 'n';

      if (isConfirmation || isDenial) {
        addUserMessage(inputValue);
        clearInput();
        
        if (isConfirmation) {
          await handleConfirmation({
            pendingAction,
            onComplete: () => setPendingAction(null),
            onSuccess: (message) => {
              addSystemMessage(message);
              toast({
                title: "Success",
                description: "Action completed successfully",
              });
            },
            onError: (error) => {
              console.error('Error executing action:', error);
              addSystemMessage("Sorry, I encountered an error while executing the action.");
              toast({
                title: "Error",
                description: "Failed to execute the requested action",
                variant: "destructive",
              });
            }
          });
        } else {
          addSystemMessage("Action cancelled.");
          setPendingAction(null);
        }
        return;
      }
    }

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Error",
        description: "OpenAI API key not configured",
        variant: "destructive",
      });
      return;
    }

    addUserMessage(inputValue);
    clearInput();
    setIsLoading(true);

    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<string>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Request timed out. Please try a shorter message or try again later."));
      }, TIMEOUT_DURATION);
    });

    try {
      const eventsContext = prepareEventsContext(contextData?.events);
      const tasksContext = prepareTasksContext(tasks);
      const pdfContext = contextData?.pdfContent?.map(pdf => 
        `Document Content: ${pdf.content}`
      ).join('\n\n');

      const apiMessages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: getSystemMessage(eventsContext, pdfContext, tasksContext)
        } as const,
        ...chatMessages.map(msg => ({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text
        })),
        {
          role: "user" as const,
          content: inputValue
        }
      ];

      const response = await Promise.race<string>([
        getChatCompletion(apiMessages),
        timeoutPromise
      ]);

      clearTimeout(timeoutId);

      if (!response) {
        throw new Error("No response received from AI");
      }

      try {
        const jsonResponse = JSON.parse(response);
        
        if (jsonResponse.action === "update_event") {
          setPendingAction(jsonResponse);
          addSystemMessage(
            `I'll help you update the event (${jsonResponse.event_code}). Please confirm this action by replying with 'yes' or 'no'.`
          );
        } else {
          addSystemMessage(String(response));
        }
      } catch {
        addSystemMessage(String(response));
      }
    } catch (error: any) {
      console.error('Error in chat completion:', error);
      
      const errorMessage = error.message === "Request timed out. Please try a shorter message or try again later."
        ? error.message
        : "I apologize, but I encountered an error. Please try again with a shorter message.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      addSystemMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <ChatMessage key={index} {...message} />
              ))}
            </div>
          </ScrollArea>
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChatBox;
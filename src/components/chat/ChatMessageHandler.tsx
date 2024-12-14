import { useChatState } from "@/hooks/useChatState";
import { useTaskContext } from "@/contexts/TaskContext";
import { prepareEventsContext, prepareTasksContext, getSystemMessage } from "@/utils/chatContextUtils";
import ChatInput from "./ChatInput";
import { handleOpenAIRequest, prepareOpenAIMessages } from "@/utils/openaiUtils";
import { useActionHandler } from "./handlers/ActionHandler";

interface ChatMessageHandlerProps {
  contextData: any;
  inputValue: string;
  isLoading: boolean;
  setInputValue: (value: string) => void;
  clearInput: () => void;
}

export const ChatMessageHandler = ({
  contextData,
  inputValue,
  isLoading,
  setInputValue,
  clearInput,
}: ChatMessageHandlerProps) => {
  const {
    pendingAction,
    setPendingAction,
    addUserMessage,
    addSystemMessage,
    messages: chatMessages,
    setIsLoading,
    toast
  } = useChatState();

  const { tasks } = useTaskContext();
  const { handlePendingAction } = useActionHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with input:', inputValue);
    if (!inputValue.trim()) return;

    // Handle pending actions first
    if (pendingAction) {
      console.log('Handling pending action:', pendingAction);
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
          setIsLoading(true);
          await handlePendingAction(pendingAction, true);
          setIsLoading(false);
        } else {
          await handlePendingAction(pendingAction, false);
        }
        return;
      }
    }

    // Check for OpenAI API key
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      toast({
        title: "Error",
        description: "OpenAI API key not configured",
        variant: "destructive",
      });
      return;
    }

    // Add user message immediately and clear input
    console.log('Adding user message:', inputValue);
    addUserMessage(inputValue);
    clearInput();
    setIsLoading(true);

    try {
      const eventsContext = prepareEventsContext(contextData?.events);
      const tasksContext = prepareTasksContext(tasks);
      const pdfContext = contextData?.pdfContent?.map(pdf => 
        `Document Content: ${pdf.content}`
      ).join('\n\n');

      const systemMessage = getSystemMessage(eventsContext, pdfContext, tasksContext);
      const messages = prepareOpenAIMessages(systemMessage, chatMessages, inputValue);

      console.log('Sending request to OpenAI...', { messages });

      const response = await handleOpenAIRequest(
        messages,
        () => {
          toast({
            title: "Error",
            description: "Request timed out. Please try a shorter message.",
            variant: "destructive",
          });
        }
      );

      console.log('Received response from OpenAI:', response);

      if (!response) {
        throw new Error("No response received from AI");
      }

      try {
        const jsonResponse = JSON.parse(response);
        console.log('Parsed JSON response:', jsonResponse);
        
        if (jsonResponse.action === "update_task" || jsonResponse.action === "update_event") {
          setPendingAction(jsonResponse);
          addSystemMessage(
            `I'll help you update the ${jsonResponse.action === "update_task" ? "task" : "event"}. Please confirm this action by replying with 'yes' or 'no'.`
          );
        } else {
          addSystemMessage(response);
        }
      } catch (error) {
        console.log('Response is not JSON, adding as plain text');
        addSystemMessage(response);
      }
    } catch (error: any) {
      console.error('Error in chat completion:', error);
      
      const errorMessage = error.message === "Request timed out. Please try a shorter message or try again later."
        ? error.message
        : "I apologize, but I encountered an error. Please try again.";
      
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
    <ChatInput
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
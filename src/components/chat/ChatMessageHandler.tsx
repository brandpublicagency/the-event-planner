import { useChatState } from "@/hooks/useChatState";
import { useTaskContext } from "@/contexts/TaskContext";
import { prepareEventsContext, prepareTasksContext, getSystemMessage } from "@/utils/chatContextUtils";
import ChatInput from "./ChatInput";
import { handleMessage } from "@/utils/whatsappUtils";
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
    
    if (!inputValue.trim()) {
      console.log('Empty input, skipping submission');
      return;
    }

    try {
      // Add user message immediately and clear input
      console.log('Adding user message:', inputValue);
      addUserMessage(inputValue);
      clearInput();
      setIsLoading(true);

      // Use WhatsApp message handler
      const response = await handleMessage({
        type: 'text',
        text: { body: inputValue }
      });

      console.log('Received response:', response);

      if (response.type === 'text') {
        addSystemMessage(response.message);
      } else if (response.type === 'interactive') {
        // Handle interactive messages (buttons, lists)
        const message = response.interactive.body.text;
        addSystemMessage(message);
        
        // You might want to add UI elements for buttons/lists here
        if (response.interactive.action?.buttons) {
          // Add button options as a separate message
          const buttonOptions = response.interactive.action.buttons
            .map(button => `- ${button.reply.title}`)
            .join('\n');
          addSystemMessage(`Available actions:\n${buttonOptions}`);
        }
      }
    } catch (error: any) {
      console.error('Error in chat completion:', error);
      
      const errorMessage = "I apologize, but I encountered an error. Please try again.";
      
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
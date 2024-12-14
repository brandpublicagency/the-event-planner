import { useChatState } from "@/hooks/useChatState";
import { useTaskContext } from "@/contexts/TaskContext";
import { prepareEventsContext, prepareTasksContext, getSystemMessage } from "@/utils/chatContextUtils";
import ChatInput from "./ChatInput";
import { handleMessage } from "@/utils/whatsappUtils";
import { useActionHandler } from "./handlers/ActionHandler";
import { getChatCompletion } from "@/services/openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

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

      // Prepare context for the AI
      const eventsContext = contextData?.events ? prepareEventsContext(contextData.events) : "";
      const tasksContext = tasks ? prepareTasksContext(tasks) : "";
      const systemMessage = getSystemMessage(eventsContext, contextData?.pdfContent, tasksContext);

      // First try to get a natural language response
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: systemMessage },
        ...chatMessages.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        })),
        { role: "user", content: inputValue }
      ];

      const aiResponse = await getChatCompletion(messages);
      
      if (aiResponse) {
        addSystemMessage(aiResponse);
      } else {
        // Fallback to WhatsApp handler if AI doesn't provide a response
        const response = await handleMessage({
          type: 'text',
          text: { body: inputValue }
        });

        console.log('Received response:', response);

        if (response.type === 'text') {
          addSystemMessage(response.message);
        } else if (response.type === 'interactive') {
          const message = response.interactive.body.text;
          addSystemMessage(message);
          
          if (response.interactive.action?.sections) {
            const listOptions = response.interactive.action.sections
              .map(section => {
                const sectionItems = section.rows
                  .map(row => `- ${row.title}: ${row.description}`)
                  .join('\n');
                return `${section.title}:\n${sectionItems}`;
              })
              .join('\n\n');
            
            addSystemMessage(`Available options:\n${listOptions}`);
          }
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
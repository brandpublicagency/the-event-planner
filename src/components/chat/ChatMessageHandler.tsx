import { useChatState } from "@/hooks/useChatState";
import { useTaskContext } from "@/contexts/TaskContext";
import { getChatCompletion } from "@/services/openai";
import { prepareEventsContext, prepareTasksContext, getSystemMessage } from "@/utils/chatContextUtils";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import ChatInput from "./ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const TIMEOUT_DURATION = 45000;

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

  const { tasks, updateTask } = useTaskContext();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Handle pending actions first
    if (pendingAction) {
      const isConfirmation = inputValue.toLowerCase().includes('yes') || 
                            inputValue.toLowerCase().includes('confirm') ||
                            inputValue.toLowerCase() === 'y';
      const isDenial = inputValue.toLowerCase().includes('no') || 
                      inputValue.toLowerCase().includes('cancel') ||
                      inputValue.toLowerCase() === 'n';

      if (isConfirmation || isDenial) {
        // Add user message immediately
        addUserMessage(inputValue);
        clearInput();
        
        if (isConfirmation) {
          setIsLoading(true);
          try {
            if (pendingAction.action === "update_task") {
              const task = tasks.find(t => t.id === pendingAction.task_id);
              if (task) {
                await updateTask(task.id, pendingAction.updates);
                addSystemMessage(`Task "${task.title}" has been updated successfully.`);
                await queryClient.invalidateQueries({ queryKey: ['tasks'] });
                toast({
                  title: "Success",
                  description: "Task updated successfully",
                });
              }
            } else if (pendingAction.action === "update_event") {
              const { error } = await supabase
                .from('events')
                .update(pendingAction.updates)
                .eq('event_code', pendingAction.event_code);

              if (error) throw error;

              await queryClient.invalidateQueries({ queryKey: ['events'] });
              await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });

              addSystemMessage(`Event has been updated successfully.`);
              toast({
                title: "Success",
                description: "Event updated successfully",
              });
            }
            setPendingAction(null);
          } catch (error: any) {
            console.error('Error executing action:', error);
            addSystemMessage("Sorry, I encountered an error while executing the action.");
            toast({
              title: "Error",
              description: error.message || "Failed to execute the requested action",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        } else {
          addSystemMessage("Action cancelled.");
          setPendingAction(null);
        }
        return;
      }
    }

    // Check for OpenAI API key
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "Error",
        description: "OpenAI API key not configured",
        variant: "destructive",
      });
      return;
    }

    // Add user message immediately and clear input
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
          role: "system" as const,
          content: getSystemMessage(eventsContext, pdfContext, tasksContext)
        },
        ...chatMessages.map(msg => ({
          role: (msg.isUser ? "user" : "assistant") as const,
          content: msg.text
        })),
        {
          role: "user" as const,
          content: inputValue
        }
      ];

      console.log('Sending request to OpenAI...', { apiMessages });

      const response = await Promise.race([
        getChatCompletion(apiMessages),
        timeoutPromise
      ]);

      clearTimeout(timeoutId);
      console.log('Received response from OpenAI:', response);

      if (!response) {
        throw new Error("No response received from AI");
      }

      try {
        const jsonResponse = JSON.parse(response);
        
        if (jsonResponse.action === "update_task" || jsonResponse.action === "update_event") {
          setPendingAction(jsonResponse);
          addSystemMessage(
            `I'll help you update the ${jsonResponse.action === "update_task" ? "task" : "event"}. Please confirm this action by replying with 'yes' or 'no'.`
          );
        } else {
          addSystemMessage(response);
        }
      } catch {
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
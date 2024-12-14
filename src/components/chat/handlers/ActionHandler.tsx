import { handleChatAction } from "@/utils/chatActionHandler";
import { PendingAction } from "@/types/chat";
import { useChatState } from "@/hooks/useChatState";
import { useQueryClient } from "@tanstack/react-query";

export const useActionHandler = () => {
  const { addSystemMessage, setPendingAction, toast } = useChatState();
  const queryClient = useQueryClient();

  const handlePendingAction = async (
    pendingAction: PendingAction,
    isConfirmed: boolean
  ) => {
    if (!isConfirmed) {
      addSystemMessage("Action cancelled.");
      setPendingAction(null);
      return;
    }

    try {
      await handleChatAction(
        pendingAction,
        (message) => {
          addSystemMessage(message);
          setPendingAction(null);
          queryClient.invalidateQueries();
        },
        (error) => {
          console.error('Error executing action:', error);
          addSystemMessage("Sorry, I encountered an error while executing the action.");
          toast({
            title: "Error",
            description: error.message || "Failed to execute the requested action",
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      console.error('Error in action handler:', error);
      addSystemMessage("An error occurred while processing your request.");
    }
  };

  return { handlePendingAction };
};

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
      console.log('Executing action:', pendingAction);
      
      // Fix nested updates structure if needed
      if (pendingAction.action === "update_event" && 
          pendingAction.updates && 
          pendingAction.updates.event_code && 
          pendingAction.updates.updates) {
        console.log('Detected nested updates structure in ActionHandler, fixing...');
        pendingAction.updates = pendingAction.updates.updates;
      }
      
      await handleChatAction(
        pendingAction,
        (message) => {
          addSystemMessage(message);
          setPendingAction(null);
          
          // Invalidate queries to refresh UI data
          console.log('Action completed, invalidating queries');
          queryClient.invalidateQueries();
        },
        (error) => {
          console.error('Error executing action:', error);
          addSystemMessage("Sorry, I encountered an error while executing the action: " + error.message);
          toast({
            title: "Error",
            description: error.message || "Failed to execute the requested action",
            variant: "destructive",
          });
          setPendingAction(null);
        }
      );
    } catch (error) {
      console.error('Error in action handler:', error);
      addSystemMessage("An error occurred while processing your request.");
      setPendingAction(null);
    }
  };

  return { handlePendingAction };
};

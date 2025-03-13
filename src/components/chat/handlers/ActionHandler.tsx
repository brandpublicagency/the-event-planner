
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
      
      // Fix nested updates structure - ensure we have a clean updates object
      if (pendingAction.action === "update_event" && pendingAction.updates) {
        // First, make a clean copy of the updates
        const cleanUpdates = { ...pendingAction.updates };
        
        // Check if we have a nested structure and fix it
        if (cleanUpdates.event_code && cleanUpdates.updates) {
          console.log('Detected nested updates structure in ActionHandler, fixing...');
          pendingAction.updates = { ...cleanUpdates.updates };
          // Keep the event_code at the top level where it belongs
          pendingAction.event_code = cleanUpdates.event_code;
        }
        
        // Special handling for venues to ensure it's an array
        if (pendingAction.updates.venues) {
          console.log('Processing venues in ActionHandler:', pendingAction.updates.venues);
          if (!Array.isArray(pendingAction.updates.venues)) {
            if (typeof pendingAction.updates.venues === 'string') {
              pendingAction.updates.venues = [pendingAction.updates.venues];
              console.log('Converted venues to array:', pendingAction.updates.venues);
            }
          }
        }
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
            title: "Action failed",
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

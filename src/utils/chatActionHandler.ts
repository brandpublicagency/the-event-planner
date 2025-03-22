
import { PendingAction } from "@/types/chat";

/**
 * Handle pending actions from chat interactions
 */
export const handlePendingAction = async (action: PendingAction, isConfirmed: boolean): Promise<void> => {
  console.log("Handling pending action:", action, "Confirmed:", isConfirmed);
  
  if (!isConfirmed) {
    console.log("Action was rejected by user");
    return;
  }
  
  try {
    // Implement action handling based on action type
    switch (action.action) {
      case "create_event":
        console.log("Creating event...");
        // Implement event creation logic
        break;
      case "send_whatsapp":
        console.log("Sending WhatsApp message...");
        // Implement WhatsApp sending logic
        break;
      default:
        console.log("Unknown action type:", action.action);
    }
  } catch (error) {
    console.error("Error executing action:", error);
  }
};

/**
 * Handle chat actions with callbacks for success and error
 */
export const handleChatAction = async (
  action: PendingAction,
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
) => {
  try {
    await handlePendingAction(action, true);
    // Default success message if no specific message is generated
    onSuccess(`Action ${action.action} executed successfully.`);
  } catch (error) {
    onError(error instanceof Error ? error : new Error("Unknown error executing action"));
  }
};

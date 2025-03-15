
import type { PendingAction } from "@/types/chat";

/**
 * Attempts to identify potential actions from the AI's response
 * by looking for JSON-like patterns in the message
 * @param message The AI response message
 * @returns A parsed PendingAction object if one is detected, null otherwise
 */
export const identifyActionFromAI = (message: string): PendingAction | null => {
  try {
    // Check if the message contains JSON-like patterns
    const jsonPattern = /```json\s*({[\s\S]*?})\s*```/;
    const match = message.match(jsonPattern);
    
    if (match && match[1]) {
      // Parse the JSON found in the message
      const actionData = JSON.parse(match[1]);
      
      // Validate that this is a proper action object
      if (actionData && actionData.action) {
        // Add a confirmation message if one wasn't included
        if (!actionData.confirmationMessage) {
          // Create context-specific confirmation messages
          switch (actionData.action) {
            case 'update_event':
              actionData.confirmationMessage = `Would you like me to update the event ${actionData.event_code}?`;
              break;
            case 'update_menu':
              actionData.confirmationMessage = `Would you like me to update the menu for event ${actionData.event_code}?`;
              break;
            case 'send_email':
              actionData.confirmationMessage = `Would you like me to send an email to ${actionData.to.join(', ')}?`;
              break;
            case 'create_event':
              actionData.confirmationMessage = 'Would you like me to create this new event?';
              break;
            case 'delete_event':
              actionData.confirmationMessage = `Are you sure you want to delete the event ${actionData.event_code}? This cannot be undone.`;
              break;
            case 'create_task':
              actionData.confirmationMessage = 'Would you like me to create this new task?';
              break;
            case 'update_task':
              actionData.confirmationMessage = 'Would you like me to update this task?';
              break;
            case 'delete_task':
              actionData.confirmationMessage = 'Are you sure you want to delete this task? This cannot be undone.';
              break;
            default:
              actionData.confirmationMessage = 'Would you like me to proceed with this action?';
          }
        }
        
        console.log('Action identified:', actionData);
        return actionData as PendingAction;
      }
    }
    
    // No valid action found
    return null;
  } catch (error) {
    console.error('Error parsing action from AI response:', error);
    return null;
  }
};

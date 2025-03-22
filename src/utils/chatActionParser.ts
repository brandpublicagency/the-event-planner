
import type { PendingAction } from "@/types/chat";

/**
 * Attempts to identify potential actions from the AI's response
 * by looking for JSON-like patterns in the message
 * @param message The AI response message
 * @returns A parsed PendingAction object if one is detected, null otherwise
 */
export const identifyActionFromAI = (message: string): PendingAction | null => {
  try {
    // Check for JSON action pattern in various formats
    
    // First, try the standard JSON block format
    const jsonBlockPattern = /```json\s*({\s*"action":.+?})\s*```/s;
    const jsonBlockMatch = message.match(jsonBlockPattern);
    
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      // Found a JSON block, attempt to parse it
      const actionData = JSON.parse(jsonBlockMatch[1]);
      if (actionData && actionData.action) {
        return prepareActionWithConfirmation(actionData);
      }
    }
    
    // Next, try to find a json object anywhere in the text
    const jsonPattern = /(\{\s*"action"\s*:\s*"[^"]+"\s*,[\s\S]*?\})/;
    const jsonMatch = message.match(jsonPattern);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const actionData = JSON.parse(jsonMatch[1]);
        if (actionData && actionData.action) {
          return prepareActionWithConfirmation(actionData);
        }
      } catch (parseError) {
        console.log('Could not parse apparent JSON object:', parseError);
        // Continue to other pattern matching attempts
      }
    }
    
    // Check if the message contains text like "action: create_task" followed by details
    const actionPattern = /action[":]\s*["']?(\w+)["']?/i;
    const actionMatch = message.match(actionPattern);
    
    if (actionMatch && actionMatch[1]) {
      const action = actionMatch[1];
      
      // Extract parameters based on the identified action
      if (action === 'update_event') {
        const eventCodeMatch = message.match(/event_code[":]\s*["']?([A-Z0-9-]+)["']?/i);
        const eventCode = eventCodeMatch ? eventCodeMatch[1] : null;
        
        if (eventCode) {
          // Try to extract updates
          const updatesMatch = message.match(/updates[":]\s*(\{[\s\S]*?\})/);
          const updatesText = updatesMatch ? updatesMatch[1] : null;
          
          if (updatesText) {
            try {
              // Sanitize the JSON text by ensuring proper quotes
              const sanitized = updatesText
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
                .replace(/:\s*(['"])([^'"]*)\1/g, ':"$2"');
              
              const updates = JSON.parse(sanitized);
              
              return prepareActionWithConfirmation({
                action: 'update_event',
                event_code: eventCode,
                updates
              });
            } catch (error) {
              console.error('Error parsing updates from text:', error);
              // Failed to parse, but we still know it's an update action
              return prepareActionWithConfirmation({
                action: 'update_event',
                event_code: eventCode,
                updates: {}
              });
            }
          }
        }
      }
    }
    
    // No valid action found
    return null;
  } catch (error) {
    console.error('Error parsing action from AI response:', error);
    return null;
  }
};

/**
 * Define the AIAction interface that was missing
 */
export interface AIAction {
  type: string;
  payload: any;
  displayName?: string;
  description?: string;
}

/**
 * Prepares a PendingAction object with an appropriate confirmation message
 */
const prepareActionWithConfirmation = (actionData: any): PendingAction => {
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
        actionData.confirmationMessage = `Would you like me to send an email to ${Array.isArray(actionData.to) ? actionData.to.join(', ') : actionData.to}?`;
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
};

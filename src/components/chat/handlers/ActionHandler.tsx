
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { createNewEvent } from "@/utils/createEventUtils";
import { updateEvent } from "@/utils/eventUpdateUtils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the AIAction type since it's missing from any imported module
interface AIAction {
  type: string;
  payload: any;
  displayName?: string;
  description?: string;
}

interface ActionHandlerProps {
  action: AIAction;
  onComplete: (success: boolean, message: string) => void;
}

export const ActionHandler = ({ action, onComplete }: ActionHandlerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleAction = useCallback(async () => {
    setIsExecuting(true);
    
    try {
      let success = false;
      let message = "";

      // Handle different action types
      switch (action.type) {
        case "create_event":
          toast.info("Creating event...", {
            duration: 0, // No auto dismiss
            id: "create-event", // Use ID for later reference
          });
          
          try {
            const eventCode = await createNewEvent(action.payload);
            success = true;
            message = `Event created successfully with code: ${eventCode}`;
            
            toast.success(message, {
              id: "create-event",
              duration: 4000,
            });
          } catch (error) {
            success = false;
            message = error instanceof Error ? error.message : String(error);
            
            toast.error(message, {
              id: "create-event",
              duration: 4000,
            });
          }
          break;

        case "update_event":
          toast.info("Updating event...", {
            duration: 0,
            id: "update-event",
          });
          
          const updateResult = await updateEvent(action.payload.event_code, action.payload.updates);
          success = updateResult.success;
          message = updateResult.message;
          
          if (success) {
            toast.success(message, {
              id: "update-event",
              duration: 4000,
            });
          } else {
            toast.error(message, {
              id: "update-event",
              duration: 4000,
            });
          }
          break;

        case "send_whatsapp":
          toast.info("WhatsApp messaging not implemented", {
            duration: 0,
            id: "send-whatsapp",
          });
          
          success = false;
          message = "WhatsApp messaging feature is not yet implemented";
          
          toast.error(message, {
            id: "send-whatsapp",
            duration: 4000,
          });
          break;

        default:
          message = "Unknown action type";
          success = false;
          toast.error(message, {
            duration: 4000,
          });
      }

      setResult({ success, message });
      onComplete(success, message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResult({
        success: false,
        message: `Error: ${errorMessage}`,
      });
      onComplete(false, `Error: ${errorMessage}`);
      console.error("Action execution error:", error);
    } finally {
      setIsExecuting(false);
    }
  }, [action, onComplete]);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="default" 
        className="bg-blue-600 hover:bg-blue-700 text-white mb-2"
        disabled={isExecuting}
      >
        {isExecuting ? "Processing..." : action.displayName || "Execute Action"}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to execute the action: {action.displayName}?
              {action.description && (
                <p className="mt-2 text-sm">{action.description}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isExecuting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleAction();
              }}
              disabled={isExecuting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isExecuting ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Create a hook to use the ActionHandler
export const useActionHandler = () => {
  const handlePendingAction = async (action: any) => {
    return new Promise<boolean>((resolve) => {
      // This would be implemented to handle pending actions
      console.log("Handling pending action:", action);
      resolve(true);
    });
  };

  return { handlePendingAction };
};

export default ActionHandler;

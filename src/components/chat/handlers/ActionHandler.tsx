
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { AIAction } from "@/utils/chatActionParser";
import { createEvent } from "@/utils/createEventUtils";
import { updateEvent } from "@/utils/eventUpdateUtils";
import { handleWhatsAppAction } from "@/utils/whatsappUtils";
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
          
          const result = await createEvent(action.payload);
          success = result.success;
          message = result.message;
          
          if (success) {
            toast.success(message, {
              id: "create-event",
              duration: 4000,
            });
          } else {
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
          
          const updateResult = await updateEvent(action.payload);
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
          toast.info("Sending WhatsApp message...", {
            duration: 0,
            id: "send-whatsapp",
          });
          
          const whatsappResult = await handleWhatsAppAction(action.payload);
          success = whatsappResult.success;
          message = whatsappResult.message;
          
          if (success) {
            toast.success(message, {
              id: "send-whatsapp",
              duration: 4000,
            });
          } else {
            toast.error(message, {
              id: "send-whatsapp",
              duration: 4000,
            });
          }
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

export default ActionHandler;

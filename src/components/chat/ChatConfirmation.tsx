
import { handleConfirmation } from "@/components/chat/handlers/confirmationHandler";
import { useChatState } from "@/hooks/useChatState";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type { PendingAction } from "@/types/chat";

interface ChatConfirmationProps {
  pendingAction: PendingAction;
}

const ChatConfirmation = ({ pendingAction }: ChatConfirmationProps) => {
  const { addSystemMessage, setPendingAction, toast } = useChatState();

  const handleConfirm = async () => {
    await handleConfirmation({
      pendingAction,
      onComplete: () => setPendingAction(null),
      onSuccess: (message) => addSystemMessage(message),
      onError: (error) => {
        console.error('Error during action confirmation:', error);
        addSystemMessage(`Error: ${error.message}`);
        toast({
          title: "Action failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleCancel = () => {
    addSystemMessage("Action cancelled.");
    setPendingAction(null);
  };

  return (
    <div className="p-3 bg-amber-50 border-t border-amber-100">
      <div className="flex items-start gap-3">
        <div className="p-1 bg-amber-100 rounded-full text-amber-600">
          <Info size={16} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">Confirm Action</p>
          <p className="text-xs text-amber-600 mt-1">
            {pendingAction.confirmationMessage || "Are you sure you want to proceed with this action?"}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCancel}
          className="h-8 text-xs"
        >
          Cancel
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleConfirm}
          className="h-8 text-xs bg-amber-600 hover:bg-amber-700"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ChatConfirmation;


import { handleChatAction } from "@/utils/chatActionHandler";
import type { PendingAction } from "@/types/chat";

interface ConfirmationHandlerProps {
  pendingAction: PendingAction;
  onComplete: () => void;
  onSuccess: (message: string) => void;
  onError: (error: Error) => void;
}

export const handleConfirmation = async ({
  pendingAction,
  onComplete,
  onSuccess,
  onError
}: ConfirmationHandlerProps) => {
  try {
    await handleChatAction(
      pendingAction,
      (message) => onSuccess(message),
      (error) => onError(error)
    );
  } finally {
    onComplete();
  }
};

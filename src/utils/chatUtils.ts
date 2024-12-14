import { ChatMessageForAPI, PendingAction } from "@/types/chat";
import { getChatCompletion } from "@/services/openai";
import { prepareEventsContext, getSystemMessage } from "@/utils/chatContextUtils";

const TIMEOUT_DURATION = 45000;

export const handleChatSubmission = async ({
  messages,
  inputValue,
  contextData,
  onSuccess,
  onError
}: {
  messages: ChatMessageForAPI[];
  inputValue: string;
  contextData: any;
  onSuccess: (response: string) => void;
  onError: (error: Error) => void;
}) => {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<string>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Request timed out. Please try a shorter message or try again later."));
    }, TIMEOUT_DURATION);
  });

  try {
    const eventsContext = prepareEventsContext(contextData?.events);
    const pdfContext = contextData?.pdfContent?.map((pdf: any) => 
      `Document Content: ${pdf.content}`
    ).join('\n\n');

    const systemMessage = getSystemMessage(eventsContext, pdfContext);

    const response = await Promise.race<string>([
      getChatCompletion([systemMessage, ...messages]),
      timeoutPromise
    ]);

    clearTimeout(timeoutId);

    if (!response) {
      throw new Error("No response received from AI");
    }

    onSuccess(response);
  } catch (error: any) {
    onError(error);
  }
};

export const handlePendingAction = (
  inputValue: string,
  pendingAction: PendingAction | null,
  callbacks: {
    onConfirm: () => Promise<void>;
    onDeny: () => void;
    onInvalid?: () => void;
  }
) => {
  const isConfirmation = inputValue.toLowerCase().includes('yes') || 
                        inputValue.toLowerCase().includes('confirm') ||
                        inputValue.toLowerCase() === 'y';
  const isDenial = inputValue.toLowerCase().includes('no') || 
                   inputValue.toLowerCase().includes('cancel') ||
                   inputValue.toLowerCase() === 'n';

  if (isConfirmation) {
    return callbacks.onConfirm();
  } else if (isDenial) {
    callbacks.onDeny();
  } else if (callbacks.onInvalid) {
    callbacks.onInvalid();
  }
};
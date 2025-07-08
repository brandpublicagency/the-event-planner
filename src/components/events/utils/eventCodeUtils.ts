
import { useToast } from "@/hooks/use-toast";

export const useCopyEventCode = () => {
  const copyEventCode = (eventCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(eventCode).then(() => {
      // Successfully copied
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  return copyEventCode;
};

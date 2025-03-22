
import { useToast } from "@/hooks/use-toast";

export const useCopyEventCode = () => {
  const { toast } = useToast();
  
  const copyEventCode = (eventCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(eventCode).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `Event code ${eventCode} copied to clipboard`,
        duration: 3000,
        position: "sidebar"
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy event code to clipboard",
        duration: 3000,
        position: "sidebar"
      });
    });
  };
  
  return copyEventCode;
};

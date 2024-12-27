import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Getting file URL for:', filePath);
      
      const { data: fileData } = await supabase.storage
        .from("task-files")
        .download(filePath);

      if (!fileData) {
        throw new Error('Could not download file');
      }

      // Create a blob URL for the file
      const blob = new Blob([fileData], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      console.log('[View] Opening file:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error: any) {
      console.error('[View] Error:', error);
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleView,
    isLoading,
  };
}
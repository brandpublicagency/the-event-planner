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
      
      // Get the public URL for the file
      const { data } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        console.error('[View] Error getting public URL');
        throw new Error('Could not generate URL for file');
      }

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Simulate a click to open in a new tab
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('[View] File opened successfully');
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Starting file view for:', filePath);
      
      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60);

      if (error) {
        console.error('[View] Error getting signed URL:', error);
        throw new Error('Failed to generate file URL');
      }

      if (!data?.signedUrl) {
        throw new Error('Could not generate URL for file');
      }

      // Simply open the URL in a new tab
      window.open(data.signedUrl, '_blank');
      
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
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
      
      // Get the signed URL for the file
      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error || !data?.signedUrl) {
        throw new Error('Could not generate signed URL for file');
      }

      // Open in new tab
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      console.log('[View] File opened successfully:', data.signedUrl);
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
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
      
      // Get a direct download URL instead of just the public URL
      const { data: { publicUrl }, error } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (error || !publicUrl) {
        console.error('[View] Error getting public URL:', error);
        throw new Error('Could not generate URL for file');
      }

      // Open the URL in a new tab
      window.open(publicUrl, '_blank', 'noopener,noreferrer');
      
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
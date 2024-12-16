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
      
      const { data: { publicUrl } } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Could not generate public URL for file');
      }

      // Open in new tab with security best practices
      const newWindow = window.open();
      if (newWindow) {
        newWindow.opener = null;
        newWindow.location.href = publicUrl;
      }

      console.log('[View] File opened successfully:', publicUrl);
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
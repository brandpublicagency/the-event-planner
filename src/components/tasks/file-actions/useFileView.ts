import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('[View] Starting file view for:', filePath);
      
      // Get the public URL directly - no need to await since this is synchronous
      const { data } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Could not generate public URL for file');
      }

      console.log('[View] Opening file in new tab:', data.publicUrl);
      window.open(data.publicUrl, "_blank", "noopener,noreferrer");
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

  return { handleView, isLoading };
}
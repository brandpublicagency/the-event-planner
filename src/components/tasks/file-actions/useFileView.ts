import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('[View] Starting file view for:', filePath);
      
      const { data: { publicUrl }, error } = await supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (error) {
        console.error('[View] Error getting public URL:', error);
        throw error;
      }

      console.log('[View] Opening file in new tab:', publicUrl);
      window.open(publicUrl, "_blank");
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
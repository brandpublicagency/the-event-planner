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
      
      const { data: publicUrl } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!publicUrl?.publicUrl) {
        console.error('[View] Error getting public URL');
        throw new Error('Could not generate public URL for file');
      }

      console.log('[View] Opening file URL:', publicUrl.publicUrl);
      window.open(publicUrl.publicUrl, '_blank');
      
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
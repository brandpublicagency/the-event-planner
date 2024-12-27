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
        throw new Error('Could not generate view URL');
      }

      console.log('[View] Opening file:', publicUrl.publicUrl);
      window.open(publicUrl.publicUrl, '_blank', 'noopener,noreferrer');
      
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
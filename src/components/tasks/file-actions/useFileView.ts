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
      
      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 3600); // Increased to 1 hour

      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error('Could not generate view URL');
      }

      console.log('[View] Opening file:', data.signedUrl);
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    const timeoutDuration = 10000; // 10 seconds timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), timeoutDuration);
    });

    try {
      setIsLoading(true);
      console.log('[View] Getting file URL for:', filePath);
      
      // Race between the file operation and timeout
      const { data } = await Promise.race([
        supabase.storage
          .from("task-files")
          .getPublicUrl(filePath),
        timeoutPromise
      ]) as { data: { publicUrl: string } };

      if (!data?.publicUrl) {
        throw new Error('Could not generate URL for file');
      }

      console.log('[View] Opening file:', data.publicUrl);
      window.open(data.publicUrl, '_blank', 'noopener,noreferrer');
      
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
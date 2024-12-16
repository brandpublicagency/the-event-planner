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
      
      // Create a signed URL that expires in 60 seconds
      const { data: signedData, error: signedError } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60);

      if (signedError || !signedData?.signedUrl) {
        console.error('[View] Error creating signed URL:', signedError);
        throw new Error('Could not generate signed URL for file');
      }

      console.log('[View] Opening file URL:', signedData.signedUrl);
      window.open(signedData.signedUrl, '_blank');
      
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
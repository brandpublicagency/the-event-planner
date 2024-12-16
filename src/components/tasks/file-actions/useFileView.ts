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
      
      // Get the public URL but we need to transform it
      const { data } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Could not generate URL for file');
      }

      // Transform the URL to use the direct download endpoint
      const downloadUrl = data.publicUrl.replace('/object/public/', '/object/sign/');
      
      // Add download=true parameter to force download for non-image files
      const finalUrl = `${downloadUrl}?download=true`;
      
      console.log('[View] Opening file URL:', finalUrl);
      window.open(finalUrl, '_blank');
      
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
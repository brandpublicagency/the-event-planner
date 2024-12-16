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

      // Get the file metadata to determine content type
      const { data: fileData, error: fileError } = await supabase.storage
        .from("task-files")
        .list('', {
          search: filePath,
          limit: 1
        });

      if (fileError || !fileData?.length) {
        console.error('[View] Error getting file metadata:', fileError);
        throw new Error('Could not get file metadata');
      }

      const contentType = fileData[0].metadata?.mimetype;
      console.log('[View] File content type:', contentType);

      // For images, open in new tab. For other files, force download
      const finalUrl = contentType?.startsWith('image/') 
        ? signedData.signedUrl
        : `${signedData.signedUrl}&download=true`;

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
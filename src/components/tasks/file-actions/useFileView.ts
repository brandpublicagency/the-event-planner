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
      
      // Get the file metadata to check content type
      const { data: fileData, error: fileError } = await supabase.storage
        .from("task-files")
        .list('', {
          search: filePath,
          limit: 1
        });

      if (fileError) {
        console.error('[View] Error getting file metadata:', fileError);
        throw new Error('Could not get file metadata');
      }

      console.log('[View] File metadata:', fileData?.[0]);

      // Get the public URL for the file
      const { data } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        console.error('[View] Error getting public URL');
        throw new Error('Could not generate URL for file');
      }

      const mimeType = fileData?.[0]?.metadata?.mimetype;
      console.log('[View] File mime type:', mimeType);

      // For images and PDFs, open in new tab
      if (mimeType?.startsWith('image/') || mimeType === 'application/pdf') {
        console.log('[View] Opening file in new tab:', data.publicUrl);
        window.open(data.publicUrl, '_blank');
      } else {
        // For other files, trigger download
        console.log('[View] Downloading file:', data.publicUrl);
        const a = document.createElement('a');
        a.href = data.publicUrl;
        a.download = filePath.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
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
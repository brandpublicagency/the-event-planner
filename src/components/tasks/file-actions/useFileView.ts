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
      
      // First get the file metadata to check content type
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

      const { data } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        console.error('[View] Error getting public URL');
        throw new Error('Could not generate URL for file');
      }

      // For images and PDFs, open in new tab
      if (fileData?.[0]?.metadata?.mimetype?.startsWith('image/') || 
          fileData?.[0]?.metadata?.mimetype === 'application/pdf') {
        window.open(data.publicUrl, '_blank');
      } else {
        // For other files, trigger download
        const response = await fetch(data.publicUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
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
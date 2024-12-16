import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Starting file view for:', filePath);
      
      // Get the file metadata first to check content type
      const { data: fileData, error: fileMetaError } = await supabase
        .from('task_files')
        .select('content_type')
        .eq('file_path', filePath)
        .single();

      if (fileMetaError) {
        throw new Error('Failed to get file metadata');
      }

      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60);

      if (error) {
        console.error('[View] Error getting signed URL:', error);
        throw new Error('Failed to generate file URL');
      }

      if (!data?.signedUrl) {
        throw new Error('Could not generate URL for file');
      }

      // If it's an image or PDF, open in new tab
      if (fileData.content_type?.startsWith('image/') || fileData.content_type === 'application/pdf') {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        // For other file types, trigger download
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = filePath.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
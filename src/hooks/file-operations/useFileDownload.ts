
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const downloadFile = async (filePath: string, fileName: string, contentType: string) => {
    try {
      setIsLoading(true);
      console.log('[Download] Getting file:', filePath);

      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Download the file directly
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(filePath);
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Could not retrieve file');
      }
      
      // Create a blob with the correct content type
      const blob = new Blob([data], { type: contentType });
      
      // Create a blob URL from the file content
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a download link and trigger click
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

      toast({
        title: "Success",
        description: "File download started",
      });
    } catch (error: any) {
      console.error('[Download] Error:', error);
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadFile,
    isLoading
  };
}

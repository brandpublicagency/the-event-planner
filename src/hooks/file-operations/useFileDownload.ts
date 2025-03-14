
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

      // Get public URL for the file
      const { data } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(filePath);
        
      if (!data?.publicUrl) {
        throw new Error('Could not generate download URL');
      }
      
      // Create a download link and trigger click
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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

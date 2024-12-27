import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      setIsLoading(true);
      console.log('[Download] Getting file for:', filePath);
      
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(filePath);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Could not download file');
      }

      // Create a blob URL for the file
      const url = URL.createObjectURL(data);

      // Create a temporary link element for downloading
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(url);

      console.log('[Download] File download completed');
    } catch (error: any) {
      console.error('[Download] Error:', error);
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDownload,
    isLoading,
  };
}
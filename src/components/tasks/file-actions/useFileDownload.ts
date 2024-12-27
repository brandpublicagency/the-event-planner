import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      setIsLoading(true);
      console.log('[Download] Getting file:', filePath);

      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 3600); // Increased to 1 hour

      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error('Could not generate download URL');
      }

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.setAttribute('download', fileName); // Force download with original filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('[Download] File downloaded successfully');
      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
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
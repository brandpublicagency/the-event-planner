import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      setIsLoading(true);
      console.log('[Download] Getting file:', filePath);

      const { data } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate download URL');
      }

      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.setAttribute('download', fileName);
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadFile,
    isLoading
  };
}
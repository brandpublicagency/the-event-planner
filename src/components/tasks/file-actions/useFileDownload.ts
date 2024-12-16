import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (filePath: string, fileName: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('[Download] Starting download for:', filePath);
      
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(filePath);

      if (error) {
        console.error('[Download] Error downloading file:', error);
        throw new Error('You do not have permission to download this file');
      }

      console.log('[Download] File downloaded successfully');
      
      // Create a download link for the blob
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
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

  return { handleDownload, isLoading };
}
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (filePath: string, fileName: string) => {
    const timeoutDuration = 15000; // 15 seconds timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Download request timed out')), timeoutDuration);
    });

    try {
      setIsLoading(true);
      console.log('[Download] Getting file:', filePath);

      // Race between the download operation and timeout
      const { data, error } = await Promise.race([
        supabase.storage
          .from("task-files")
          .download(filePath),
        timeoutPromise
      ]) as { data: Blob | null; error: Error | null };

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data received');
      }

      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

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
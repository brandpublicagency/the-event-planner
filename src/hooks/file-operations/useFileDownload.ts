
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);

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
      
      // For direct download, we'll use the Fetch API to get the file as a blob
      const response = await fetch(data.publicUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      // Create a download link and trigger click
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 100);

      console.log("File download started");
    } catch (error: any) {
      console.error('[Download] Error:', error);
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

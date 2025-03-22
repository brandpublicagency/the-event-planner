
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      setIsLoading(true);
      console.log('[Download] Getting file:', filePath);

      const { data } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate download URL');
      }

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('[Download] File downloaded successfully');
    } catch (error: any) {
      console.error('[Download] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDownload,
    isLoading,
  };
}

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      setIsLoading(true);
      console.log('[Download] Getting file URL for:', filePath);
      
      // Get a direct download URL
      const { data: { publicUrl }, error } = supabase.storage
        .from("task-files")
        .getPublicUrl(filePath);

      if (error || !publicUrl) {
        throw new Error('Could not generate download URL');
      }

      // Create a temporary link element for downloading
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('[Download] File download initiated');
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
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
      
      const { data: { signedUrl }, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60);

      if (error) throw error;
      
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error: any) {
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
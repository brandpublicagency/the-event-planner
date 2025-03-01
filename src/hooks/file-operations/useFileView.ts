
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const viewFile = async (filePath: string, contentType: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Getting file URL for:', filePath);
      
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }
      
      // Download the file content directly for viewing in a new tab
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(filePath);
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Could not retrieve file');
      }
      
      // Create a blob with the correct content type
      const blob = new Blob([data], { type: contentType });
      
      // Create a blob URL from the file content with proper content type
      const blobUrl = URL.createObjectURL(blob);
      
      // Open in a new tab
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      
      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      
      console.log('[View] File opened successfully');
    } catch (error: any) {
      console.error('[View] Error:', error);
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    viewFile,
    isLoading
  };
}

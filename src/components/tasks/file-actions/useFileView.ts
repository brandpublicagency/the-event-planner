
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);

  const handleView = async (filePath: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Getting file URL for:', filePath);
      
      const { data } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate view URL');
      }

      console.log('[View] Opening file:', data.publicUrl);
      window.open(data.publicUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error: any) {
      console.error('[View] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleView,
    isLoading,
  };
}

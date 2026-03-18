
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);

  const handleView = async (filePath: string) => {
    try {
      setIsLoading(true);
      const { data } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate view URL');
      }
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

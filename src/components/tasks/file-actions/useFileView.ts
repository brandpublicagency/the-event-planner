import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      const { data: { signedUrl }, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60);

      if (error) throw error;
      
      window.open(signedUrl, "_blank");
    } catch (error: any) {
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleView, isLoading };
}
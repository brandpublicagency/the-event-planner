
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function useFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadFile = async (file: File, taskId: string) => {
    try {
      setIsLoading(true);
      console.log('[Upload] Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${taskId}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("taskmanager-files")
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("task_files")
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_path: filePath,
          content_type: file.type
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      toast({
        title: "File uploaded",
        description: "File uploaded successfully",
        variant: "success"
      });
    } catch (error: any) {
      console.error('[Upload] Error:', error);
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    isLoading
  };
}

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useFileView() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = async (filePath: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Starting file view for:', filePath);
      
      // First verify file access permission
      const { data: fileData, error: fileError } = await supabase
        .from('task_files')
        .select('task_id')
        .eq('file_path', filePath)
        .single();

      if (fileError) {
        console.error('[View] Error getting file data:', fileError);
        throw new Error('File not found');
      }

      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('user_id, assigned_to')
        .eq('id', fileData.task_id)
        .single();

      if (taskError) {
        console.error('[View] Error getting task data:', taskError);
        throw new Error('Task not found');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (task.user_id !== user.id && task.assigned_to !== user.id) {
        throw new Error('You do not have permission to view this file');
      }

      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60);

      if (error) {
        console.error('[View] Error getting signed URL:', error);
        throw new Error('Failed to generate file URL');
      }

      if (!data?.signedUrl) {
        throw new Error('Could not generate URL for file');
      }

      // Open in new tab
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      console.log('[View] File opened successfully');
    } catch (error: any) {
      console.error('[View] Error:', error);
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleView,
    isLoading,
  };
}
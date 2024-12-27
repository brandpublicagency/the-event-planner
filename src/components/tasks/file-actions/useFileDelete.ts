import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function useFileDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (file: { id: string; task_id: string; file_path: string }) => {
    const timeoutDuration = 10000; // 10 seconds timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Delete request timed out')), timeoutDuration);
    });

    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log('[Delete] Starting file deletion:', file);

      // Race between the delete operation and timeout for storage
      const { error: storageError } = await Promise.race([
        supabase.storage
          .from("task-files")
          .remove([file.file_path]),
        timeoutPromise
      ]) as { error: Error | null };

      if (storageError) {
        console.error('[Delete] Storage deletion error:', storageError);
        throw storageError;
      }

      console.log('[Delete] Storage deletion successful');

      // Race between the delete operation and timeout for database
      const { error: dbError } = await Promise.race([
        supabase
          .from("task_files")
          .delete()
          .eq("id", file.id),
        timeoutPromise
      ]) as { error: Error | null };

      if (dbError) {
        console.error('[Delete] Database deletion error:', dbError);
        throw dbError;
      }

      console.log('[Delete] Database deletion successful');

      // Invalidate queries to refresh the file list
      await queryClient.invalidateQueries({ 
        queryKey: ["task-files", file.task_id] 
      });

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error: any) {
      console.error('[Delete] Error:', error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { 
    handleDelete, 
    isDeleting 
  };
}
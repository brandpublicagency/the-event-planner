
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useFileDelete() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const deleteFile = async (filePath: string, fileId: string, taskId: string) => {
    try {
      setIsLoading(true);
      console.log('[Delete] Starting file deletion:', { filePath, fileId, taskId });

      // Delete from database first to maintain referential integrity
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", fileId);

      if (dbError) {
        console.error('[Delete] Database deletion error:', dbError);
        throw dbError;
      }

      console.log('[Delete] Database deletion successful');

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from("taskmanager-files")
        .remove([filePath]);

      if (storageError) {
        console.error('[Delete] Storage deletion error:', storageError);
        // Don't throw here as the database record is already deleted
        console.warn(`File record deleted but error removing file: ${storageError.message}`);
      } else {
        console.log('[Delete] Storage deletion successful');
      }

      // Always invalidate queries regardless of storage deletion success
      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      
      console.log("File deleted successfully");
      
      return true;
    } catch (error: any) {
      console.error('[Delete] Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteFile,
    isLoading
  };
}

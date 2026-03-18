
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFileDelete() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (file: { id: string; task_id: string; file_path: string }) => {
      try {
        // First delete from database to maintain referential integrity
        const { error: dbError } = await supabase
          .from("task_files")
          .delete()
          .eq("id", file.id);

        if (dbError) {
          console.error('[Delete] Database deletion error:', dbError);
          throw new Error(`Failed to delete file record: ${dbError.message}`);
        }
        // Then delete from storage
        const { error: storageError } = await supabase.storage
          .from("taskmanager-files")
          .remove([file.file_path]);

        if (storageError) {
          console.error('[Delete] Storage deletion error:', storageError);
          // Don't throw here as the database record is already deleted
          console.warn(`Warning: Failed to delete file from storage: ${storageError.message}`);
        }
        return file.task_id;
      } catch (error) {
        console.error('[Delete] Error during deletion:', error);
        throw error;
      }
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
    },
    onError: (error: Error) => {
      console.error('[Delete] Error:', error);
    }
  });

  return { 
    handleDelete: (file: { id: string; task_id: string; file_path: string }) => 
      deleteMutation.mutate(file),
    isDeleting: deleteMutation.isPending 
  };
}

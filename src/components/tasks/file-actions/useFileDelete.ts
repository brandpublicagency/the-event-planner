import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useFileDelete() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (file: { id: string; task_id: string; file_path: string }) => {
      console.log('[Delete] Starting file deletion:', file);

      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError) {
        console.error('[Delete] Storage deletion error:', storageError);
        throw storageError;
      }

      console.log('[Delete] Storage deletion successful');

      // Then delete from database
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        console.error('[Delete] Database deletion error:', dbError);
        throw dbError;
      }

      console.log('[Delete] Database deletion successful');
      return file.task_id;
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error: Error) => {
      console.error('[Delete] Error:', error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return { 
    handleDelete: (file: { id: string; task_id: string; file_path: string }) => 
      deleteMutation.mutate(file),
    isDeleting: deleteMutation.isPending 
  };
}
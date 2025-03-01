
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function useFileDelete() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteFile = async (filePath: string, fileId: string, taskId: string) => {
    try {
      setIsLoading(true);
      console.log('[Delete] Starting file deletion:', { filePath, fileId, taskId });

      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

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
        .from("task-files")
        .remove([filePath]);

      if (storageError) {
        console.error('[Delete] Storage deletion error:', storageError);
        // Don't throw here as the database record is already deleted
        toast({
          title: "Warning",
          description: `File record deleted but error removing file: ${storageError.message}`,
          variant: "destructive",
        });
      } else {
        console.log('[Delete] Storage deletion successful');
      }

      // Always invalidate queries regardless of storage deletion success
      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error('[Delete] Error:', error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
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

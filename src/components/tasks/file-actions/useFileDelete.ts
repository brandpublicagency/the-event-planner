import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { checkFileExists } from "@/utils/fileOperations";

export function useFileDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (file: { id: string; task_id: string; file_path: string }) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log('Starting file deletion:', file);
      
      // First check if file exists in storage
      const { exists, error: checkError } = await checkFileExists(file.file_path);
      
      if (checkError) {
        console.error('Error checking file existence:', checkError);
        throw checkError;
      }

      // If file exists in storage, delete it
      if (exists) {
        const { error: storageError } = await supabase.storage
          .from("task-files")
          .remove([file.file_path]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          throw storageError;
        }
        console.log('Storage deletion successful');
      } else {
        console.log('File not found in storage, proceeding with database cleanup');
      }

      // Then delete from database
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

      console.log('Database deletion successful');

      // Invalidate queries to refresh the file list
      await queryClient.invalidateQueries({ 
        queryKey: ["task-files", file.task_id] 
      });

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
}
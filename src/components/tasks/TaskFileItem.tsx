import { FileText } from "lucide-react";
import { FileActions } from "./file-actions/FileActions";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskFile {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  content_type: string;
}

interface TaskFileItemProps {
  file: TaskFile;
  onDelete?: () => void;
}

export const TaskFileItem = ({ file, onDelete }: TaskFileItemProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting file deletion:', file);
      
      try {
        // First delete from storage
        const { error: storageError } = await supabase.storage
          .from("task-files")
          .remove([file.file_path]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          throw storageError;
        }

        console.log('Storage deletion successful');

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
        return true;
      } catch (error: any) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-files", file.task_id] });
      toast({
        title: "File deleted",
        description: "File has been deleted successfully.",
      });
      if (onDelete) {
        onDelete();
      }
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{file.file_name}</span>
      </div>
      <FileActions 
        file={file} 
        onDelete={() => deleteMutation.mutate()} 
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
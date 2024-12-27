import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { deleteFile } from "@/utils/fileOperations";

export function useFileDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (file: { id: string; task_id: string; file_path: string }) => {
      if (isDeleting) return;
      setIsDeleting(true);
      
      try {
        await deleteFile(file.file_path, file.id, file.task_id);
        return file.task_id;
      } finally {
        setIsDeleting(false);
      }
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ 
        queryKey: ["task-files", taskId] 
      });
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
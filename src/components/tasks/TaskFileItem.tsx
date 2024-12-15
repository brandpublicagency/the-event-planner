import { useState } from "react";
import { FileText, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface TaskFile {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  content_type: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskFileItemProps {
  file: TaskFile;
}

export function TaskFileItem({ file }: TaskFileItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      console.log("Starting file deletion process for:", file);

      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        throw new Error(`Failed to delete file from storage: ${storageError.message}`);
      }

      console.log("Successfully deleted from storage");

      // Add a delay to ensure storage system processes the deletion
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get the directory and filename from the file path
      const pathParts = file.file_path.split('/');
      const directory = pathParts[0];
      const filename = pathParts[pathParts.length - 1];

      // Verify the file is actually deleted from storage
      const { data: storageCheck, error: listError } = await supabase.storage
        .from("task-files")
        .list(directory);

      if (listError) {
        console.error("Error checking storage after deletion:", listError);
        throw new Error(`Failed to verify storage deletion: ${listError.message}`);
      }

      const fileStillExists = storageCheck?.some(f => f.name === filename);

      if (fileStillExists) {
        console.error("File still exists in storage:", filename);
        throw new Error("File still exists in storage after deletion attempt");
      }

      // Then delete from the database
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        console.error("Database deletion error:", dbError);
        throw new Error(`Failed to delete file record: ${dbError.message}`);
      }

      return file.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-files", file.task_id] });
      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      console.error("File deletion error:", error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(file.file_path);

      if (error) throw error;

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{file.file_name}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="h-8 w-8"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteFileMutation.mutate()}
          disabled={isDeleting}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
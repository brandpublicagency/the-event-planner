import { Button } from "@/components/ui/button";
import { FileIcon, Loader2, Trash2, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskFile {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string;
  created_at: string;
}

interface TaskFileItemProps {
  file: TaskFile;
}

export function TaskFileItem({ file }: TaskFileItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      console.log("Starting file deletion process for:", file);

      // First check if the file still exists in the database
      const { data: existingFile, error: checkError } = await supabase
        .from("task_files")
        .select()
        .eq("id", file.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking file existence:", checkError);
        throw new Error(`Failed to check file existence: ${checkError.message}`);
      }

      if (!existingFile) {
        console.log("File already deleted from database");
        return;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        console.error("Database deletion error:", dbError);
        throw new Error(`Database deletion failed: ${dbError.message}`);
      }

      console.log("Successfully deleted from database, now removing from storage");

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        // Even if storage deletion fails, the file reference is already removed from DB
        throw new Error(`Storage deletion failed: ${storageError.message}`);
      }

      console.log("Successfully deleted from storage");
    },
    onSuccess: () => {
      console.log("File deletion completed successfully");
      queryClient.invalidateQueries({ queryKey: ["task-files"] });
      toast({
        title: "File deleted",
        description: "The file has been removed successfully.",
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
  });

  const handleViewFile = async () => {
    try {
      const { data } = await supabase.storage
        .from("task-files")
        .createSignedUrl(file.file_path, 60);

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      console.error("Error viewing file:", error);
      toast({
        title: "Error viewing file",
        description: "Could not generate file preview URL.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(file.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: "Could not download the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-[7px] border">
      <div className="flex items-center gap-2">
        <FileIcon className="h-4 w-4 text-blue-500" />
        <div>
          <p className="text-sm font-medium">{file.file_name}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(file.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleViewFile}
          title="View file"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadFile}
          title="Download file"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteFileMutation.mutate()}
          disabled={deleteFileMutation.isPending}
        >
          {deleteFileMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
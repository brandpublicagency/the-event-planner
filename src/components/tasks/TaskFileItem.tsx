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
      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Then delete from database
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-files"] });
      toast({
        title: "File deleted",
        description: "The file has been removed successfully.",
      });
    },
    onError: (error: Error) => {
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
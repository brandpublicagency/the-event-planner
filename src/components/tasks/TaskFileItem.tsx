import { useState } from "react";
import { FileText, Download, Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TaskFile {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  content_type: string;
  created_at: string;
}

interface TaskFileItemProps {
  file: TaskFile;
}

export const TaskFileItem = ({ file }: TaskFileItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log('Deleting file:', file.file_path);
      
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw new Error(`Failed to delete file from storage: ${storageError.message}`);
      }

      // Then delete from the database
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw new Error(`Failed to delete file record: ${dbError.message}`);
      }

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["task-files", file.task_id] });

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error: any) {
      console.error("File deletion error:", error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      console.log('Downloading file:', file.file_path);
      const { data, error } = await supabase.storage
        .from("task-files")
        .download(file.file_path);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleView = async () => {
    try {
      console.log('Viewing file:', file.file_path);
      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(file.file_path, 60);

      if (error) {
        console.error('Signed URL error:', error);
        throw error;
      }

      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      console.error('View error:', error);
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{file.file_name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleView}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
        </Button>
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
          onClick={handleDelete}
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
};
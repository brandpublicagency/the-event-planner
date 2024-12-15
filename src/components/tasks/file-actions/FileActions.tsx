import { useState } from "react";
import { Eye, Download, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileActionButton } from "./FileActionButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FileActionsProps {
  file: {
    id: string;
    task_id: string;
    file_name: string;
    file_path: string;
  };
}

export function FileActions({ file }: FileActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (isDeleting || isLoading) return;
    
    try {
      setIsDeleting(true);
      
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw storageError;
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

  const handleDownload = async (e: React.MouseEvent) => {
    if (isDeleting || isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      
      const { data: { signedUrl }, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(file.file_path, 60);

      if (error) throw error;
      
      const response = await fetch(signedUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error: any) {
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (e: React.MouseEvent) => {
    if (isDeleting || isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      
      const { data: { signedUrl }, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(file.file_path, 60);

      if (error) throw error;
      
      window.open(signedUrl, "_blank");
    } catch (error: any) {
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <FileActionButton
        icon={Eye}
        onClick={handleView}
        disabled={isDeleting || isLoading}
      />
      <FileActionButton
        icon={Download}
        onClick={handleDownload}
        disabled={isDeleting || isLoading}
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <FileActionButton
            icon={isDeleting ? Loader2 : Trash2}
            disabled={isDeleting || isLoading}
            variant="ghost"
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
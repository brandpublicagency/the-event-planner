import { useState } from "react";
import { Eye, Download, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getSignedUrl } from "@/utils/fileOperations";
import { FileActionButton } from "./FileActionButton";
import { supabase } from "@/integrations/supabase/client";

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
    
    console.log('[Delete] Starting deletion process for file:', {
      id: file.id,
      taskId: file.task_id,
      path: file.file_path
    });
    
    try {
      setIsDeleting(true);
      
      // Delete from storage first
      console.log('[Delete] Attempting to delete from storage:', file.file_path);
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([file.file_path]);

      if (storageError && !storageError.message?.includes('404')) {
        console.error('[Delete] Storage deletion error:', storageError);
        throw storageError;
      }

      console.log('[Delete] Storage deletion successful or file not found');

      // Then delete from database
      console.log('[Delete] Attempting to delete from database:', file.id);
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        console.error('[Delete] Database deletion error:', dbError);
        throw dbError;
      }

      console.log('[Delete] Database deletion successful');
      
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["task-files", file.task_id] });

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error: any) {
      console.error('[Delete] Error during deletion:', error);
      toast({
        title: "Error deleting file",
        description: error.message || 'Failed to delete file',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (isDeleting || isLoading) return;

    try {
      setIsLoading(true);
      console.log('[Download] Starting download process for file:', {
        id: file.id,
        name: file.file_name,
        path: file.file_path
      });
      
      const signedUrl = await getSignedUrl(file.file_path);
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

      console.log('[Download] File downloaded successfully');
    } catch (error: any) {
      console.error('[Download] Download process failed:', error);
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async () => {
    if (isDeleting || isLoading) return;

    try {
      setIsLoading(true);
      console.log('[View] Starting view process for file:', {
        id: file.id,
        name: file.file_name,
        path: file.file_path
      });
      
      const signedUrl = await getSignedUrl(file.file_path);
      window.open(signedUrl, "_blank");
    } catch (error: any) {
      console.error('[View] View process failed:', error);
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
      <FileActionButton
        icon={isDeleting ? Loader2 : Trash2}
        onClick={handleDelete}
        disabled={isDeleting || isLoading}
        variant="ghost"
      />
    </div>
  );
}

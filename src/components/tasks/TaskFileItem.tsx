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
      console.log('[Delete] Starting deletion process for file:', {
        id: file.id,
        name: file.file_name,
        path: file.file_path,
        taskId: file.task_id
      });
      
      // First check if file exists in storage
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("task-files")
        .list(file.file_path.split('/')[0], {
          search: file.file_path.split('/')[1]
        });

      console.log('[Delete] Storage check result:', {
        exists: existingFiles && existingFiles.length > 0,
        filesFound: existingFiles?.length,
        listError
      });

      if (listError) {
        console.error('[Delete] Error checking file existence:', listError);
        throw new Error(`Failed to check file existence: ${listError.message}`);
      }

      // Delete from storage if file exists
      if (existingFiles && existingFiles.length > 0) {
        console.log('[Delete] File exists in storage, proceeding with deletion');
        const { error: storageError } = await supabase.storage
          .from("task-files")
          .remove([file.file_path]);

        console.log('[Delete] Storage deletion result:', {
          success: !storageError,
          error: storageError
        });

        if (storageError) {
          console.error('[Delete] Storage deletion error:', storageError);
          throw new Error(`Failed to delete file from storage: ${storageError.message}`);
        }
      } else {
        console.log('[Delete] File not found in storage, proceeding with database cleanup');
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", file.id);

      console.log('[Delete] Database deletion result:', {
        success: !dbError,
        error: dbError
      });

      if (dbError) {
        console.error('[Delete] Database deletion error:', dbError);
        throw new Error(`Failed to delete file record: ${dbError.message}`);
      }

      // Invalidate queries to refresh UI
      console.log('[Delete] Invalidating queries for task files');
      await queryClient.invalidateQueries({ queryKey: ["task-files", file.task_id] });

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      console.log('[Delete] File deletion completed successfully');
    } catch (error: any) {
      console.error('[Delete] Deletion process failed:', error);
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
      console.log('[Download] Starting download process for file:', {
        id: file.id,
        name: file.file_name,
        path: file.file_path
      });
      
      // Check if file exists
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("task-files")
        .list(file.file_path.split('/')[0], {
          search: file.file_path.split('/')[1]
        });

      console.log('[Download] Storage check result:', {
        exists: existingFiles && existingFiles.length > 0,
        filesFound: existingFiles?.length,
        listError
      });

      if (!existingFiles || existingFiles.length === 0) {
        throw new Error("File not found in storage");
      }

      // Get signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("task-files")
        .createSignedUrl(file.file_path, 60);

      console.log('[Download] Signed URL generation result:', {
        success: !!signedUrlData,
        error: signedUrlError
      });

      if (signedUrlError) {
        console.error('[Download] Signed URL error:', signedUrlError);
        throw signedUrlError;
      }

      // Download file
      console.log('[Download] Attempting to fetch file from signed URL');
      const response = await fetch(signedUrlData.signedUrl);
      
      console.log('[Download] Fetch response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });

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
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('[Download] File downloaded successfully');
    } catch (error: any) {
      console.error('[Download] Download process failed:', error);
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleView = async () => {
    try {
      console.log('[View] Starting view process for file:', {
        id: file.id,
        name: file.file_name,
        path: file.file_path
      });
      
      // Check if file exists
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("task-files")
        .list(file.file_path.split('/')[0], {
          search: file.file_path.split('/')[1]
        });

      console.log('[View] Storage check result:', {
        exists: existingFiles && existingFiles.length > 0,
        filesFound: existingFiles?.length,
        listError
      });

      if (!existingFiles || existingFiles.length === 0) {
        throw new Error("File not found in storage");
      }

      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(file.file_path, 60);

      console.log('[View] Signed URL generation result:', {
        success: !!data,
        error: error
      });

      if (error) {
        console.error('[View] Signed URL error:', error);
        throw error;
      }

      console.log('[View] Opening file in new window');
      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      console.error('[View] View process failed:', error);
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
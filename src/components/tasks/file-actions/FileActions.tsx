import { useState } from "react";
import { Eye, Download, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { deleteFile, getSignedUrl } from "@/utils/fileOperations";
import { FileActionButton } from "./FileActionButton";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deleteFile(file.file_path, file.id, file.task_id);
      
      console.log('[Delete] Invalidating queries for task files');
      await queryClient.invalidateQueries({ queryKey: ["task-files", file.task_id] });
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
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
      
      const signedUrl = await getSignedUrl(file.file_path);
      
      console.log('[Download] Attempting to fetch file from signed URL');
      const response = await fetch(signedUrl);
      
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
      
      const signedUrl = await getSignedUrl(file.file_path);
      console.log('[View] Opening file in new window');
      window.open(signedUrl, "_blank");
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
    <div className="flex items-center gap-1">
      <FileActionButton
        icon={Eye}
        onClick={handleView}
      />
      <FileActionButton
        icon={Download}
        onClick={handleDownload}
      />
      <FileActionButton
        icon={isDeleting ? Loader2 : Trash2}
        onClick={handleDelete}
        disabled={isDeleting}
        variant="ghost"
      />
    </div>
  );
}
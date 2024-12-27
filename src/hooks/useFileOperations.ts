import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface FileOperations {
  uploadFile: (file: File, taskId: string) => Promise<void>;
  downloadFile: (filePath: string, fileName: string) => Promise<void>;
  viewFile: (filePath: string) => Promise<void>;
  deleteFile: (filePath: string, fileId: string, taskId: string) => Promise<void>;
  isLoading: boolean;
}

export function useFileOperations(): FileOperations {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadFile = async (file: File, taskId: string) => {
    try {
      setIsLoading(true);
      console.log('[Upload] Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Generate a unique file path
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${taskId}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("task-files")
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Create database record
      const { error: dbError } = await supabase
        .from("task_files")
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_path: filePath,
          content_type: file.type
        });

      if (dbError) {
        throw dbError;
      }

      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      console.error('[Upload] Error:', error);
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      setIsLoading(true);
      console.log('[Download] Getting file:', filePath);

      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60); // URL valid for 1 minute

      if (error) {
        console.error('[Download] Signed URL error:', error);
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error('Could not generate download URL');
      }

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "File download started",
      });
    } catch (error: any) {
      console.error('[Download] Error:', error);
      toast({
        title: "Error downloading file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewFile = async (filePath: string) => {
    try {
      setIsLoading(true);
      console.log('[View] Getting file URL for:', filePath);
      
      const { data, error } = await supabase.storage
        .from("task-files")
        .createSignedUrl(filePath, 60); // URL valid for 1 minute

      if (error) {
        console.error('[View] Signed URL error:', error);
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error('Could not generate view URL');
      }

      console.log('[View] Opening file:', data.signedUrl);
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      console.error('[View] Error:', error);
      toast({
        title: "Error viewing file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (filePath: string, fileId: string, taskId: string) => {
    try {
      setIsLoading(true);
      console.log('[Delete] Starting file deletion:', { filePath, fileId, taskId });

      // First delete from database to maintain referential integrity
      const { error: dbError } = await supabase
        .from("task_files")
        .delete()
        .eq("id", fileId);

      if (dbError) {
        console.error('[Delete] Database deletion error:', dbError);
        throw new Error(`Failed to delete file record: ${dbError.message}`);
      }

      console.log('[Delete] Database record deleted successfully');

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from("task-files")
        .remove([filePath]);

      if (storageError) {
        console.error('[Delete] Storage deletion error:', storageError);
        // Don't throw here as the database record is already deleted
        console.warn(`Warning: Failed to delete file from storage: ${storageError.message}`);
      }

      console.log('[Delete] Storage file deleted successfully');

      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error: any) {
      console.error('[Delete] Error:', error);
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    downloadFile,
    viewFile,
    deleteFile,
    isLoading
  };
}
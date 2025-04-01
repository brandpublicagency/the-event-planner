
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export function useFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const uploadFile = async (file: File, taskId: string) => {
    try {
      setIsLoading(true);
      setProgress(0);
      
      console.log('[Upload] Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${taskId}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Construct the direct Supabase Storage API URL
      const supabaseUrl = "https://gqkhnmlytbvklkyktcwt.supabase.co";
      const apiUrl = `${supabaseUrl}/storage/v1/object/taskmanager-files/${filePath}`;
      
      // Make a direct fetch request to Supabase Storage REST API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
          // Do NOT set Content-Type here - browser will set it automatically with FormData
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Supabase REST API error:', errorData);
        throw new Error(`Upload failed: ${errorData.error || response.statusText}`);
      }
      
      console.log('Upload successful via direct API call');

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Add record to the task_files table
      const { error: dbError } = await supabase
        .from("task_files")
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_path: filePath,
          content_type: file.type
        });

      if (dbError) {
        console.error('[Upload] Database error:', dbError);
        throw dbError;
      }

      // Invalidate queries to refresh the file list
      queryClient.invalidateQueries({ queryKey: ["task-files", taskId] });
      
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded",
        variant: "success",
      });
      
      setProgress(100);
      return publicUrl;
    } catch (error: any) {
      console.error('[Upload] Error:', error);
      toast({
        title: "Error uploading file",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    isLoading,
    progress
  };
}

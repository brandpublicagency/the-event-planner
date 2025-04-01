
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useReliableFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, userId: string, bucketName: string = 'avatars') => {
    try {
      setIsLoading(true);
      setProgress(0);
      
      console.log('Starting file upload for:', file.name, 'type:', file.type);
      
      // Check that the file is actually an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are supported');
      }
      
      // Create a unique file path with original extension
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Get active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }
      
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Construct the direct Supabase Storage API URL
      const supabaseUrl = "https://gqkhnmlytbvklkyktcwt.supabase.co";
      const apiUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
      
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
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Upload successful",
        description: "Your profile image has been updated",
        variant: "success",
      });
      
      setProgress(100);
      return publicUrl;
    } catch (error: any) {
      console.error('[File Upload] Error:', error);
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

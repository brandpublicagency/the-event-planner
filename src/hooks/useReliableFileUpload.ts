
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
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload file directly without trying to parse it as JSON
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type // Explicitly set the content type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

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
      
      setIsLoading(false);
      setProgress(100);
      return publicUrl;
    } catch (error: any) {
      console.error('[File Upload] Error:', error);
      toast({
        title: "Error uploading file",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  return {
    uploadFile,
    isLoading,
    progress
  };
}

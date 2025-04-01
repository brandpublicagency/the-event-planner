
import { useState } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import type { UppyFile } from "@uppy/core";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useReliableFileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, userId: string, bucketName: string = 'avatars') => {
    try {
      setIsLoading(true);
      setProgress(0);
      
      console.log('Starting reliable upload for:', file.name, 'type:', file.type);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Simple direct upload method instead of resumable upload
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
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
        description: "Your file has been uploaded successfully",
        variant: "success",
      });
      
      setIsLoading(false);
      setProgress(100);
      return publicUrl;
    } catch (error: any) {
      console.error('[Reliable Upload] Error:', error);
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

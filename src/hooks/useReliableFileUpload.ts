
import { useState } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
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
      
      // Get upload authorization URL from Supabase
      const { data: uploadData } = await supabase.storage.from(bucketName).createSignedUploadUrl(filePath);
      
      if (!uploadData) {
        throw new Error('Failed to get upload URL');
      }
      
      // Initialize Uppy
      const uppy = new Uppy({
        restrictions: {
          maxNumberOfFiles: 1,
          allowedFileTypes: ['image/*']
        },
        autoProceed: true
      });
      
      // Add Tus plugin for resumable uploads
      uppy.use(Tus, {
        endpoint: `https://${process.env.SUPABASE_PROJECT_ID || 'gqkhnmlytbvklkyktcwt'}.supabase.co/storage/v1/upload/resumable`,
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa2hubWx5dGJ2a2xreWt0Y3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMDk1MjYsImV4cCI6MjA0Njc4NTUyNn0.xT3iS1sWyX0pClMadR0CFlyMGlRoiGGAXGu0yuozgZs'}`,
          'x-upsert': 'false'
        },
        chunkSize: 5 * 1024 * 1024, // 5MB chunks
        onBeforeRequest: (req) => {
          const url = new URL(req.getURL());
          url.searchParams.set('bucket', bucketName);
          url.searchParams.set('path', filePath);
          req.setURL(url.toString());
          return req;
        }
      });
      
      // Add file to Uppy
      uppy.addFile({
        name: file.name,
        type: file.type,
        data: file
      });
      
      // Track progress
      uppy.on('upload-progress', (file, progress) => {
        const percent = Math.floor((progress.bytesUploaded / progress.bytesTotal) * 100);
        setProgress(percent);
        console.log(`Upload progress: ${percent}%`);
      });
      
      // Wait for upload to complete
      return new Promise((resolve, reject) => {
        uppy.on('complete', async (result) => {
          console.log('Upload complete:', result);
          
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
            reject(updateError);
            return;
          }
          
          toast({
            title: "Upload successful",
            description: "Your file has been uploaded successfully",
            variant: "success",
          });
          
          setIsLoading(false);
          setProgress(100);
          resolve(publicUrl);
        });
        
        uppy.on('error', (error) => {
          console.error('Upload error:', error);
          setIsLoading(false);
          reject(error);
        });
      });
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


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useAvatarUpload() {
  const [isLoading, setIsLoading] = useState(false);

  const uploadAvatar = async (file: File, userId: string) => {
    try {
      setIsLoading(true);
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Check file type
      const fileType = file.type;
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(fileType)) {
        throw new Error('File type not supported. Please use JPG, PNG or WebP');
      }

      console.log('Original file type:', fileType);
      console.log('File name:', file.name);

      // Create a unique file path that follows our RLS pattern (userId as folder)
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Read the file as an ArrayBuffer to preserve binary content
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      
      // Log the first few bytes to check if it's a valid image
      console.log('File data first bytes:', [...fileData.slice(0, 16)]);
      
      // Upload using arrayBuffer to preserve binary content
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .uploadBinary(filePath, fileData, {
          contentType: fileType,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully",
        variant: "success",
      });

      return publicUrl;
    } catch (error: any) {
      console.error('[Avatar Upload] Error:', error);
      toast({
        title: "Error uploading avatar",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadAvatar,
    isLoading
  };
}

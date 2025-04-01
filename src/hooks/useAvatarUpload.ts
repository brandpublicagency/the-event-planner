
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
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validTypes = ['jpg', 'jpeg', 'png', 'webp'];
      if (!fileExt || !validTypes.includes(fileExt)) {
        throw new Error('File type not supported. Please use JPG, PNG or WebP');
      }

      // Create a unique file path that follows our RLS pattern (userId as folder)
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload the file to Supabase Storage with correct content type and caching
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

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

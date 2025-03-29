
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";

interface ProfileAvatarProps {
  profile: {
    full_name?: string | null;
    surname?: string | null;
    avatar_url?: string | null;
  } | null;
}

const ProfileAvatar = ({ profile }: ProfileAvatarProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isLoading: isUploading } = useAvatarUpload();

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      await uploadAvatar(files[0], user.id);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const firstName = profile?.full_name || '';
    const lastName = profile?.surname || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-4 group">
        <Avatar className="h-24 w-24 border-2 border-white shadow-md cursor-pointer" onClick={handleAvatarClick}>
          <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {getInitials() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div 
          className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleAvatarClick}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
        
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
      </div>
      <h2 className="text-xl font-semibold">{profile?.full_name} {profile?.surname}</h2>
      <p className="text-sm text-muted-foreground">{profile?.email}</p>
    </div>
  );
};

export default ProfileAvatar;

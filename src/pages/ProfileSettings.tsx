
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfileSection from "@/components/profile/ProfileSection";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";

// Define a type for the profile data
interface ProfileFormData {
  full_name: string;
  surname: string;
  mobile: string;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isLoading: isUploading } = useAvatarUpload();
  const [editForm, setEditForm] = useState<ProfileFormData>({
    full_name: "",
    surname: "",
    mobile: "",
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again.",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication error');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }
      
      // Initialize edit form with profile data
      if (profileData) {
        setEditForm({
          full_name: profileData.full_name || "",
          surname: profileData.surname || "",
          mobile: profileData.mobile || "",
        });
      }

      return profileData;
    },
  });

  // Create a mutation to update the profile with proper typing
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: ProfileFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidate and refetch the profile query to update the UI
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
      });
    }
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm);
  };

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium">Error loading profile</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    const firstName = profile?.full_name || '';
    const lastName = profile?.surname || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex h-full flex-col">
      <Header pageTitle="Profile Settings" />
      
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-6">
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
              
              <ProfileSection
                profile={profile}
                isEditing={isEditing}
                editForm={editForm}
                setEditForm={setEditForm}
                handleEdit={() => setIsEditing(true)}
                handleSave={handleSaveProfile}
              />
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProfileSettings;

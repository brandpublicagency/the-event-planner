
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProfileSection from "@/components/profile/ProfileSection";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 space-y-8 overflow-hidden p-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile information
          </p>
        </div>

        <ScrollArea className="h-full">
          <ProfileSection
            profile={profile}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            handleEdit={() => setIsEditing(true)}
            handleSave={handleSaveProfile}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProfileSettings;

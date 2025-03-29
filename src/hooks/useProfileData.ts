
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProfileFormData {
  full_name: string;
  surname: string;
  mobile: string;
}

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [userEmail, setUserEmail] = useState("");
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

  // Check if user has a password set
  useEffect(() => {
    const checkAuthMethod = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user && user.app_metadata) {
          // If the user has only used magic links, they won't have a password
          const providers = user.app_metadata.providers as string[] || [];
          
          // If only provider is email and user hasn't set password yet
          setHasPassword(!(providers.length === 1 && providers[0] === 'email' && !user.user_metadata?.has_set_password));
        }
      }
    };
    
    checkAuthMethod();
  }, []);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication error');
      }

      setUserEmail(user.email || "");

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  return {
    profile,
    isLoading,
    error,
    isEditing,
    editForm,
    hasPassword,
    userEmail,
    setEditForm,
    handleEdit,
    handleSave
  };
};

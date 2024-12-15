import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import ProfileFields from "./ProfileFields";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || "",
    surname: profile?.surname || "",
    mobile: profile?.mobile || "",
  });

  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleEdit = () => {
    setEditForm({
      full_name: profile?.full_name || "",
      surname: profile?.surname || "",
      mobile: profile?.mobile || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateProfile.mutateAsync(editForm);
    setIsEditing(false);
  };

  if (isProfileLoading || isAuthLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileFields
        isEditing={isEditing}
        editForm={editForm}
        setEditForm={setEditForm}
        email={authUser?.email}
      />

      <div className="flex justify-end pt-4">
        {isEditing ? (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setEditForm({
                  full_name: profile?.full_name || "",
                  surname: profile?.surname || "",
                  mobile: profile?.mobile || "",
                });
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
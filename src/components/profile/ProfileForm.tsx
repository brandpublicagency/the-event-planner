import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import ProfileFields from "./ProfileFields";
import { useProfile } from "@/hooks/useProfile";

const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, updateProfile } = useProfile();
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || "",
    surname: profile?.surname || "",
    mobile: profile?.mobile || "",
  });

  const { data: authUser } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
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
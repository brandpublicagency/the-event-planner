import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import FlipCard from "@/components/FlipCard";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const ProfileBox = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  const [editForm, setEditForm] = useState({
    full_name: "",
    surname: "",
    mobile: "",
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return profileData;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: typeof editForm) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
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
    updateProfileMutation.mutate(editForm);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  const frontContent = (
    <div className="h-full">
      <div className="relative h-full">
        <img
          src="https://www.warmkaroo.com/wp-content/uploads/2023/04/Chappel-7.jpeg"
          alt="Profile Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-semibold text-white">
            {profile?.full_name || 'Welcome'}
          </h2>
          {profile?.surname && (
            <p className="mt-1 text-sm text-white/80">{profile.surname}</p>
          )}
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-200 p-4">
        <h3 className="text-lg font-semibold text-zinc-900">Profile Details</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <ProfileForm
          profile={profile}
          isEditing={isEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />
      </div>
    </div>
  );

  return (
    <div className="h-[450px] w-full">
      <FlipCard front={frontContent} back={backContent} onEdit={handleEdit} />
    </div>
  );
};

export default ProfileBox;
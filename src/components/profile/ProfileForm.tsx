import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

const ProfileForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
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
        .single();

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
        description: error.message,
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

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold">Profile Details</h3>
          {!isEditing && (
            <Button onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Surname</label>
                <Input
                  value={editForm.surname}
                  onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                  placeholder="Enter your surname"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  placeholder="Enter your mobile number"
                />
              </div>

              <div className="flex justify-end pt-4">
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <div className="p-2 bg-muted rounded-md">
                  {profile?.full_name || 'Not set'}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Surname</label>
                <div className="p-2 bg-muted rounded-md">
                  {profile?.surname || 'Not set'}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                <div className="p-2 bg-muted rounded-md">
                  {profile?.mobile || 'Not set'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileForm;
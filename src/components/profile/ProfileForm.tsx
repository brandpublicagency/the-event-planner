import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Save, Mail, User, Phone } from "lucide-react";

interface ProfileFormProps {
  profile?: {
    full_name: string | null;
    surname: string | null;
    mobile: string | null;
  } | null;
  isEditing: boolean;
  editForm: {
    full_name: string;
    surname: string;
    mobile: string;
  };
  setEditForm: (form: { full_name: string; surname: string; mobile: string; }) => void;
  handleEdit: () => void;
  handleSave: () => void;
}

const ProfileForm = ({ 
  profile, 
  isEditing, 
  editForm, 
  setEditForm, 
  handleEdit, 
  handleSave 
}: ProfileFormProps) => {
  const { data: authUser } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Email</label>
        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{authUser?.email || 'Not set'}</span>
        </div>
      </div>

      {isEditing ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                placeholder="Enter your name"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Surname</label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                value={editForm.surname}
                onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                placeholder="Enter your surname"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Mobile</label>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                placeholder="Enter your mobile number"
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setEditForm({
                  full_name: profile?.full_name || "",
                  surname: profile?.surname || "",
                  mobile: profile?.mobile || "",
                })}
              >
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
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.full_name || 'Not set'}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Surname</label>
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.surname || 'Not set'}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Mobile</label>
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.mobile || 'Not set'}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleEdit}>
              Edit Profile
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileForm;
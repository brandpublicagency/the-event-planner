import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

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
  return (
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
              <Button variant="outline" onClick={() => setEditForm({
                full_name: profile?.full_name || "",
                surname: profile?.surname || "",
                mobile: profile?.mobile || "",
              })}>
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
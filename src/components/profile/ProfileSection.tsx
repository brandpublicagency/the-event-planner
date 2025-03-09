
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Save, Edit, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSectionProps {
  profile: {
    id: string;
    full_name: string | null;
    surname: string | null;
    mobile: string | null;
    email: string | null;
    avatar_url: string | null;
    updated_at: string;
  } | null;
  isEditing: boolean;
  editForm: {
    full_name: string;
    surname: string;
    mobile: string;
  };
  setEditForm: (form: { full_name: string; surname: string; mobile: string }) => void;
  handleEdit: () => void;
  handleSave: () => void;
}

const ProfileSection = ({
  profile,
  isEditing,
  editForm,
  setEditForm,
  handleEdit,
  handleSave,
}: ProfileSectionProps) => {
  // Use the email from the profile if available, otherwise we'll fetch it from the session
  const [userEmail, setUserEmail] = useState(profile?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  useEffect(() => {
    // If profile doesn't have an email, get it from the session
    if (!profile?.email) {
      const getSessionEmail = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      };
      
      getSessionEmail();
    }
  }, [profile?.email]);

  const handlePasswordUpdate = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      // Clear password fields and error on success
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (error: any) {
      setPasswordError(error.message || "Error updating password");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          {isEditing ? (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{userEmail || 'Not set'}</span>
          </div>

          {isEditing ? (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                placeholder="First name"
                className="flex-1"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.full_name || 'Not set'}</span>
            </div>
          )}

          {isEditing ? (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                value={editForm.surname}
                onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                placeholder="Surname"
                className="flex-1"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.surname || 'Not set'}</span>
            </div>
          )}

          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                placeholder="Mobile number"
                className="flex-1"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.mobile || 'Not set'}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Password Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="flex-1"
              />
            </div>
            
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            
            <Button 
              onClick={handlePasswordUpdate}
              className="w-full"
              disabled={!password || !confirmPassword}
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;

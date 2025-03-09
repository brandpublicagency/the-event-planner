
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Save, Edit, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [hasPassword, setHasPassword] = useState(true);
  const { toast } = useToast();
  
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

    // Check if user has a password set
    const checkAuthMethod = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // This is a simplistic check. If the user has logged in with a magic link,
        // they will not have a password set initially.
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
      
      // Mark that user has set a password
      const { error: updateError } = await supabase.auth.updateUser({
        data: { has_set_password: true }
      });
      
      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }
      
      // Clear password fields and error on success
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setHasPassword(true);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      setPasswordError(error.message || "Error updating password");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error updating password",
      });
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
          <h3 className="text-lg font-semibold mb-4">
            {!hasPassword ? 'Set Password' : 'Password Settings'}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={!hasPassword ? "Set a new password" : "New password"}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
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
              {!hasPassword ? 'Set Password' : 'Update Password'}
            </Button>
            
            {!hasPassword && (
              <p className="text-sm text-muted-foreground mt-2">
                Setting a password will allow you to login with your email and password in the future.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;

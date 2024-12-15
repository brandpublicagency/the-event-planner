import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Save, Edit } from "lucide-react";

interface ProfileSectionProps {
  profile: any;
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
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="flex items-center space-x-2 p-2 bg-muted rounded-md mt-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.email || 'Not set'}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            {isEditing ? (
              <div className="flex items-center space-x-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Enter your name"
                  className="flex-1"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-md mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.full_name || 'Not set'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Surname</label>
            {isEditing ? (
              <div className="flex items-center space-x-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={editForm.surname}
                  onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                  placeholder="Enter your surname"
                  className="flex-1"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-md mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.surname || 'Not set'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Mobile</label>
            {isEditing ? (
              <div className="flex items-center space-x-2 mt-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  placeholder="Enter your mobile number"
                  className="flex-1"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-md mt-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.mobile || 'Not set'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;
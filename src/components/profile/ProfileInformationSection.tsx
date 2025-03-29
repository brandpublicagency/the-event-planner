
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Mail, Phone, Save, User } from "lucide-react";

interface ProfileInformationSectionProps {
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
  userEmail: string;
  setEditForm: (form: { full_name: string; surname: string; mobile: string }) => void;
  handleEdit: () => void;
  handleSave: () => void;
}

const ProfileInformationSection = ({
  profile,
  isEditing,
  editForm,
  userEmail,
  setEditForm,
  handleEdit,
  handleSave,
}: ProfileInformationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Personal Information</h3>
        {isEditing ? (
          <Button onClick={handleSave} size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        ) : (
          <Button variant="outline" onClick={handleEdit} size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-5 rounded-lg bg-muted/30 p-4">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-background">
          <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
            <p className="font-medium">{userEmail || 'Not set'}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-background">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">First Name</p>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="First name"
                  className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-background">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Surname</p>
                <Input
                  value={editForm.surname}
                  onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                  placeholder="Surname"
                  className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-background">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Mobile Number</p>
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  placeholder="Mobile number"
                  className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-background">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">First Name</p>
                <p className="font-medium">{profile?.full_name || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-background">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Surname</p>
                <p className="font-medium">{profile?.surname || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-background">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{profile?.mobile || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInformationSection;

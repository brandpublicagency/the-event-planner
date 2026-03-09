
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
  setEditForm: (form: {
    full_name: string;
    surname: string;
    mobile: string;
  }) => void;
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
  handleSave
}: ProfileInformationSectionProps) => {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Personal Information</h3>
        {isEditing ? <Button onClick={handleSave} size="sm" variant="default">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button> : <Button variant="outline" onClick={handleEdit} size="sm">
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-2.5 bg-muted/25 rounded-md">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">{userEmail || 'Not set'}</p>
          </div>
        </div>

        {isEditing ? <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-2.5 border rounded-md border-border">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input value={editForm.full_name} onChange={e => setEditForm({
            ...editForm,
            full_name: e.target.value
          })} placeholder="First name" className="border-none p-0 h-6 text-sm focus-visible:ring-0 bg-transparent" />
            </div>

            <div className="flex items-center space-x-3 p-2.5 border rounded-md border-border">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input value={editForm.surname} onChange={e => setEditForm({
            ...editForm,
            surname: e.target.value
          })} placeholder="Surname" className="border-none p-0 h-6 text-sm focus-visible:ring-0 bg-transparent" />
            </div>

            <div className="flex items-center space-x-3 p-2.5 border rounded-md border-border">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input value={editForm.mobile} onChange={e => setEditForm({
            ...editForm,
            mobile: e.target.value
          })} placeholder="Mobile number" className="border-none p-0 h-6 text-sm focus-visible:ring-0 bg-transparent" />
            </div>
          </div> : <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-2.5 bg-muted/25 rounded-md">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{profile?.full_name || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2.5 rounded-md bg-gray-100">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{profile?.surname || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2.5 bg-muted/25 rounded-md">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{profile?.mobile || 'Not set'}</p>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default ProfileInformationSection;

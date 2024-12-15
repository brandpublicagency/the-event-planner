import { Input } from "@/components/ui/input";
import { Mail, User, Phone } from "lucide-react";

interface ProfileFieldsProps {
  isEditing: boolean;
  editForm: {
    full_name: string;
    surname: string;
    mobile: string;
  };
  setEditForm: (form: { full_name: string; surname: string; mobile: string; }) => void;
  email?: string | null;
}

const ProfileFields = ({ isEditing, editForm, setEditForm, email }: ProfileFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Email</label>
        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{email || 'Not set'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Name</label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Input
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              placeholder="Enter your name"
              className="flex-1"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{editForm.full_name || 'Not set'}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Surname</label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Input
              value={editForm.surname}
              onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
              placeholder="Enter your surname"
              className="flex-1"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{editForm.surname || 'Not set'}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Mobile</label>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Input
              value={editForm.mobile}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              placeholder="Enter your mobile number"
              className="flex-1"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{editForm.mobile || 'Not set'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFields;
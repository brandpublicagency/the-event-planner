import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save } from "lucide-react";

interface ProfileFormProps {
  profile: any;
  isEditing: boolean;
  editForm: {
    full_name: string;
    surname: string;
    mobile: string;
  };
  setEditForm: (form: any) => void;
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
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-end">
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Surname</label>
            <Input
              value={editForm.surname}
              onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your surname"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mobile</label>
            <Input
              value={editForm.mobile}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-sm text-gray-500">Name</p>
            <p className="mt-1 font-medium">{profile?.full_name || 'Not set'}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-sm text-gray-500">Surname</p>
            <p className="mt-1 font-medium">{profile?.surname || 'Not set'}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-sm text-gray-500">Mobile</p>
            <p className="mt-1 font-medium">{profile?.mobile || 'Not set'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
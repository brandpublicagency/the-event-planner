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
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
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
            <label className="text-sm font-medium">Name</label>
            <Input
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Surname</label>
            <Input
              value={editForm.surname}
              onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your surname"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile</label>
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
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">Name:</span> {profile?.full_name}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">Surname:</span> {profile?.surname}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">Mobile:</span> {profile?.mobile}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
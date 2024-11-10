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
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>      
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editForm.full_name}
            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
            className="bg-white"
            onClick={handleInputClick}
            placeholder="Enter your name"
          />
          <Input
            value={editForm.surname}
            onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
            className="bg-white"
            onClick={handleInputClick}
            placeholder="Enter your surname"
          />
          <Input
            value={editForm.mobile}
            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
            className="bg-white"
            onClick={handleInputClick}
            placeholder="Enter your mobile number"
          />
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="group rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 relative">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-zinc-500">Name</p>
                <p className="font-medium text-zinc-900">{profile?.full_name || 'Not set'}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="group rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 relative">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-zinc-500">Surname</p>
                <p className="font-medium text-zinc-900">{profile?.surname || 'Not set'}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="group rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 relative">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-zinc-500">Mobile</p>
                <p className="font-medium text-zinc-900">{profile?.mobile || 'Not set'}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
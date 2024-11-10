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
    <div className="space-y-6 mt-6" onClick={(e) => e.stopPropagation()}>      
      {isEditing ? (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-zinc-500 mb-2 block">Name</label>
            <Input
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-500 mb-2 block">Surname</label>
            <Input
              value={editForm.surname}
              onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your surname"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-500 mb-2 block">Mobile</label>
            <Input
              value={editForm.mobile}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              className="bg-white"
              onClick={handleInputClick}
              placeholder="Enter your mobile number"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-zinc-500 mb-2 block">Name</label>
            <div className="group flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
              <p className="font-medium text-zinc-900">{profile?.full_name || 'Not set'}</p>
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
          <div>
            <label className="text-sm font-medium text-zinc-500 mb-2 block">Surname</label>
            <div className="group flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
              <p className="font-medium text-zinc-900">{profile?.surname || 'Not set'}</p>
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
          <div>
            <label className="text-sm font-medium text-zinc-500 mb-2 block">Mobile</label>
            <div className="group flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
              <p className="font-medium text-zinc-900">{profile?.mobile || 'Not set'}</p>
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
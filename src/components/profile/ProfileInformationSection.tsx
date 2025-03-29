
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
        <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
        {isEditing ? (
          <Button 
            onClick={handleSave} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleEdit} 
            className="text-blue-500 border-blue-200 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Email Address</label>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
            <Mail className="h-5 w-5 text-slate-400" />
            <span className="text-slate-700">{userEmail || 'Not set'}</span>
          </div>
        </div>

        {isEditing ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">First Name</label>
              <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="First name"
                  className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Surname</label>
              <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <Input
                  value={editForm.surname}
                  onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                  placeholder="Surname"
                  className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Mobile Number</label>
              <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg">
                <Phone className="h-5 w-5 text-slate-400" />
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  placeholder="Mobile number"
                  className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">First Name</label>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700">{profile?.full_name || 'Not set'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Surname</label>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700">{profile?.surname || 'Not set'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Mobile Number</label>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700">{profile?.mobile || 'Not set'}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInformationSection;

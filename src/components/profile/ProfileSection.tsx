import { Card } from "@/components/ui/card";
import ProfileForm from "./ProfileForm";

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
      <ProfileForm
        profile={profile}
        isEditing={isEditing}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEdit={handleEdit}
        handleSave={handleSave}
      />
    </Card>
  );
};

export default ProfileSection;
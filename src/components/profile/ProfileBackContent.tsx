import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ProfileForm from "./ProfileForm";

interface ProfileBackContentProps {
  onLogout: () => void;
}

const ProfileBackContent = ({ onLogout }: ProfileBackContentProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 pt-6">
        <h3 className="text-2xl font-semibold">Profile Details</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onLogout}
          className="text-red-500 hover:text-red-600 hover:bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
      <div className="flex-1 px-6 pb-6">
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfileBackContent;
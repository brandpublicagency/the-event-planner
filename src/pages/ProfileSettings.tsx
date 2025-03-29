
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useProfileData } from "@/hooks/useProfileData";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInformationSection from "@/components/profile/ProfileInformationSection";
import ProfilePasswordSection from "@/components/profile/ProfilePasswordSection";
import { Loader2 } from "lucide-react";

const ProfileSettings = () => {
  const {
    profile,
    isLoading,
    error,
    isEditing,
    editForm,
    hasPassword,
    userEmail,
    setEditForm,
    handleEdit,
    handleSave
  } = useProfileData();

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header pageTitle="Profile Settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <Header pageTitle="Profile Settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2 max-w-md px-4">
            <h3 className="text-lg font-medium">Error loading profile</h3>
            <p className="text-muted-foreground">
              We encountered an issue while loading your profile. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header pageTitle="Profile Settings" />
      
      <div className="flex-1 p-4 sm:p-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-6 shadow-sm border-slate-200">
              <ProfileAvatar profile={profile} />
              
              <ProfileInformationSection
                profile={profile}
                isEditing={isEditing}
                editForm={editForm}
                userEmail={userEmail}
                setEditForm={setEditForm}
                handleEdit={handleEdit}
                handleSave={handleSave}
              />
              
              <ProfilePasswordSection hasPassword={hasPassword} />
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProfileSettings;

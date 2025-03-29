
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useProfileData } from "@/hooks/useProfileData";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInformationSection from "@/components/profile/ProfileInformationSection";
import ProfilePasswordSection from "@/components/profile/ProfilePasswordSection";

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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium">Error loading profile</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header pageTitle="Profile Settings" />
      
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-6 shadow-sm bg-transparent border-muted/20">
              <ProfileAvatar profile={profile} userEmail={userEmail} />
              
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

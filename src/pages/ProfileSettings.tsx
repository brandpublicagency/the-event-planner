
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/layout/Header";
import { useProfileData } from "@/hooks/useProfileData";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileSection from "@/components/profile/ProfileSection";
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
    return <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium">Error loading profile</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>;
  }
  return <div className="flex h-full flex-col">
      <Header pageTitle="Profile Settings" />
      
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="rounded-lg border border-black/10 p-6 bg-white px-[18px] py-[30px]">
              <ProfileAvatar profile={profile} userEmail={userEmail} />
              
              <ProfileSection 
                profile={profile} 
                isEditing={isEditing} 
                editForm={editForm} 
                setEditForm={setEditForm} 
                handleEdit={handleEdit} 
                handleSave={handleSave} 
                hasPassword={hasPassword} 
                userEmail={userEmail} 
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>;
};
export default ProfileSettings;

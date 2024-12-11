import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/profile/ProfileForm";
import TeamManagement from "@/components/profile/TeamManagement";
import Header from "@/components/Header";

const ProfileSettings = () => {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 space-y-8 overflow-hidden p-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile information and team settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="h-full space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="h-full">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <ProfileForm />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="team" className="h-full">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <TeamManagement />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSettings;
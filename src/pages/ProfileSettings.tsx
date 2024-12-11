import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileBox from "@/components/ProfileBox";
import Header from "@/components/Header";

const ProfileSettings = () => {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 space-y-8 overflow-hidden p-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile information and account settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="h-full space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="h-full">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <ProfileBox />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="settings" className="h-full">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Settings options will be added here
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSettings;
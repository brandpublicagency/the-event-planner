
import React from "react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings as SettingsIcon, UtensilsCrossed } from "lucide-react";
import MenuConfigurationTab from "@/components/settings/MenuConfigurationTab";

const Settings = () => {
  return (
    <div className="flex h-full flex-col">
      <Header pageTitle="Settings" />
      
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-medium">Settings</h1>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="menu-config">Menu Configuration</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage your general application settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">General settings options will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="menu-config">
                <MenuConfigurationTab />
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how and when you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Notification settings options will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how the application looks.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Appearance settings options will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>Configure advanced application behavior.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Advanced settings options will be added here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Settings;


import React from "react";
import { Header } from "@/components/layout/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings as SettingsIcon } from "lucide-react";
import MenuConfigurationTab from "@/components/settings/MenuConfigurationTab";

const Settings = () => {
  return (
    <div className="flex h-full flex-col">
      <Header pageTitle="Settings" />
      
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-medium">Menu Configuration</h1>
            </div>
            
            <MenuConfigurationTab />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Settings;

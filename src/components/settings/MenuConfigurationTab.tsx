
import React from "react";
import MenuStartersSettings from "./menu/MenuStartersSettings";
import MenuMainsSettings from "./menu/MenuMainsSettings";
import MenuDessertsSettings from "./menu/MenuDessertsSettings";
import MenuOthersSettings from "./menu/MenuOthersSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed } from "lucide-react";

const MenuConfigurationTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="starters" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="starters">Starters</TabsTrigger>
          <TabsTrigger value="mains">Main Courses</TabsTrigger>
          <TabsTrigger value="desserts">Desserts</TabsTrigger>
          <TabsTrigger value="others">Other Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="starters">
          <MenuStartersSettings />
        </TabsContent>
        
        <TabsContent value="mains">
          <MenuMainsSettings />
        </TabsContent>
        
        <TabsContent value="desserts">
          <MenuDessertsSettings />
        </TabsContent>
        
        <TabsContent value="others">
          <MenuOthersSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuConfigurationTab;

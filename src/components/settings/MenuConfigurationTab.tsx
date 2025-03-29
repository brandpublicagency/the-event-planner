
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuStartersSettings from "./menu/MenuStartersSettings";
import MenuMainsSettings from "./menu/MenuMainsSettings";
import MenuDessertsSettings from "./menu/MenuDessertsSettings";
import MenuOthersSettings from "./menu/MenuOthersSettings";
import { UtensilsCrossed } from "lucide-react";

const MenuConfigurationTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Menu Configuration</CardTitle>
          </div>
          <CardDescription>
            Manage menu items that are available for events
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuConfigurationTab;

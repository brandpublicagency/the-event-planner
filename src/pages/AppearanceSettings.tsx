
import React from "react";
import { Header } from "@/components/layout/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paintbrush } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AppearanceSettings = () => {
  return (
    <div className="flex h-full flex-col">
      <Header pageTitle="Appearance Settings" />
      
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-medium">Appearance</h1>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Appearance settings options will be added here.</p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AppearanceSettings;

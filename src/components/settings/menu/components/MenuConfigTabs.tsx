
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuConfigTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

const MenuConfigTabs: React.FC<MenuConfigTabsProps> = ({ 
  children, 
  defaultValue = "starters" 
}) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="starters">Starters</TabsTrigger>
        <TabsTrigger value="mains">Main Courses</TabsTrigger>
        <TabsTrigger value="desserts">Desserts</TabsTrigger>
        <TabsTrigger value="others">Other Options</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default MenuConfigTabs;

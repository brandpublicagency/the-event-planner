
import React from "react";
import { TabsContent } from "@/components/ui/tabs";

interface MenuTabContentProps {
  value: string;
  children: React.ReactNode;
}

const MenuTabContent: React.FC<MenuTabContentProps> = ({ value, children }) => {
  return (
    <TabsContent value={value}>
      {children}
    </TabsContent>
  );
};

export default MenuTabContent;

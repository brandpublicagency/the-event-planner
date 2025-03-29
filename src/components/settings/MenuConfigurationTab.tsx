
import React from "react";
import MenuStartersSettings from "./menu/MenuStartersSettings";
import MenuMainsSettings from "./menu/MenuMainsSettings";
import MenuDessertsSettings from "./menu/MenuDessertsSettings";
import MenuOthersSettings from "./menu/MenuOthersSettings";
import MenuConfigTabs from "./menu/components/MenuConfigTabs";
import MenuTabContent from "./menu/components/MenuTabContent";
import MenuConfigHeader from "./menu/components/MenuConfigHeader";

const MenuConfigurationTab = () => {
  return (
    <div className="space-y-6">
      <MenuConfigHeader title="Menu Configuration" />
      
      <MenuConfigTabs defaultValue="starters">
        <MenuTabContent value="starters">
          <MenuStartersSettings />
        </MenuTabContent>
        
        <MenuTabContent value="mains">
          <MenuMainsSettings />
        </MenuTabContent>
        
        <MenuTabContent value="desserts">
          <MenuDessertsSettings />
        </MenuTabContent>
        
        <MenuTabContent value="others">
          <MenuOthersSettings />
        </MenuTabContent>
      </MenuConfigTabs>
    </div>
  );
};

export default MenuConfigurationTab;


import React, { useState } from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

interface MenuConfigTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

const MenuConfigTabs: React.FC<MenuConfigTabsProps> = ({ 
  children, 
  defaultValue = "starters" 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Filter and render only the active tab content
  const activeContent = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.value === activeTab
  );

  return (
    <div className="w-full space-y-4">
      <Menubar className="border-none p-0 bg-transparent">
        <MenubarMenu>
          <MenubarTrigger 
            className={`${activeTab === "starters" ? "bg-accent text-accent-foreground" : ""}`}
            onClick={() => setActiveTab("starters")}
          >
            Starters
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger 
            className={`${activeTab === "mains" ? "bg-accent text-accent-foreground" : ""}`}
            onClick={() => setActiveTab("mains")}
          >
            Main Courses
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger 
            className={`${activeTab === "desserts" ? "bg-accent text-accent-foreground" : ""}`}
            onClick={() => setActiveTab("desserts")}
          >
            Desserts
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger 
            className={`${activeTab === "others" ? "bg-accent text-accent-foreground" : ""}`}
            onClick={() => setActiveTab("others")}
          >
            Other Options
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      
      {activeContent}
    </div>
  );
};

export default MenuConfigTabs;

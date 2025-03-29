
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MenuConfigTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

// Helper to safely extract value from a React element
const isTabContent = (child: React.ReactNode): child is React.ReactElement<TabContentProps> => {
  return (
    React.isValidElement(child) &&
    child.props !== null &&
    typeof child.props === 'object' &&
    'value' in child.props &&
    typeof child.props.value === 'string'
  );
};

const MenuConfigTabs: React.FC<MenuConfigTabsProps> = ({ 
  children, 
  defaultValue = "starters" 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Get all valid tab values by looking at the children
  const tabValues = React.Children.toArray(children)
    .filter(isTabContent)
    .map(child => child.props.value);

  console.log("MenuConfigTabs rendering with tabs:", tabValues, "active tab:", activeTab);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      defaultValue={defaultValue} 
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="starters">
          Starters
        </TabsTrigger>
        <TabsTrigger value="mains">
          Main Courses
        </TabsTrigger>
        <TabsTrigger value="desserts">
          Desserts
        </TabsTrigger>
        <TabsTrigger value="others">
          Other Options
        </TabsTrigger>
      </TabsList>
      
      {React.Children.map(children, child => {
        if (isTabContent(child)) {
          return (
            <TabsContent value={child.props.value} key={child.props.value}>
              {child}
            </TabsContent>
          );
        }
        return null;
      })}
    </Tabs>
  );
};

export default MenuConfigTabs;

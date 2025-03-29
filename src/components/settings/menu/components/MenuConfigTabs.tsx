
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MenuConfigTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

const MenuConfigTabs: React.FC<MenuConfigTabsProps> = ({ 
  children, 
  defaultValue = "starters" 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Get all valid tab values by looking at the children
  const tabValues = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map(child => {
      // Add proper type checking before accessing props.value
      if (React.isValidElement(child) && child.props && 'value' in child.props) {
        return child.props.value;
      }
      return null;
    })
    .filter(Boolean);

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
        if (React.isValidElement(child) && child.props && 'value' in child.props) {
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


import React from "react";

interface MenuTabContentProps {
  value: string;
  children: React.ReactNode;
}

const MenuTabContent: React.FC<MenuTabContentProps> = ({ value, children }) => {
  return (
    <div className="mt-2">
      {children}
    </div>
  );
};

export default MenuTabContent;


import React from 'react';

interface MenuConfigHeaderProps {
  title: string;
}

const MenuConfigHeader: React.FC<MenuConfigHeaderProps> = ({ title }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Configure menu options that will be available for events
      </p>
    </div>
  );
};

export default MenuConfigHeader;

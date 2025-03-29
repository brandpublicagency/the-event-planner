
import React from 'react';
import MenuSettingsBase from './MenuSettingsBase';
import { useMenuOptions } from '@/hooks/useMenuOptions';
import { Skeleton } from '@/components/ui/skeleton';

const MenuOthersSettings = () => {
  const { options, isLoading, saveMenuOptions } = useMenuOptions('other');
  
  console.log("MenuOthersSettings render - options:", options, "isLoading:", isLoading);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  
  return (
    <MenuSettingsBase
      title="Additional Options"
      description="Configure additional menu items like beverages and extras"
      optionsData={options}
      category="other"
      onSave={saveMenuOptions}
    />
  );
};

export default MenuOthersSettings;


import React from 'react';
import MenuSettingsBase from './MenuSettingsBase';
import { useMenuOptions } from '@/hooks/useMenuOptions';
import { Skeleton } from '@/components/ui/skeleton';

const MenuStartersSettings = () => {
  const { options, isLoading, saveMenuOptions } = useMenuOptions('starter');
  
  console.log("MenuStartersSettings render - options:", options, "isLoading:", isLoading);
  
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
      title="Starter Options"
      description="Configure starter options available for events"
      optionsData={options}
      category="starter"
      onSave={saveMenuOptions}
    />
  );
};

export default MenuStartersSettings;

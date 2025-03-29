
import React, { useEffect } from 'react';
import MenuSettingsBase from './MenuSettingsBase';
import { useMenuOptions } from '@/hooks/useMenuOptions';
import { Skeleton } from '@/components/ui/skeleton';

const MenuStartersSettings = () => {
  const { options, isLoading, error, saveMenuOptions } = useMenuOptions('starter');
  
  useEffect(() => {
    console.log("MenuStartersSettings mounted", { options, isLoading, error });
    return () => console.log("MenuStartersSettings unmounted");
  }, [options, isLoading, error]);
  
  console.log("MenuStartersSettings render - options:", options, "isLoading:", isLoading, "error:", error);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-300 rounded-md">
        <h3 className="font-medium">Error loading menu options</h3>
        <p>{error}</p>
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

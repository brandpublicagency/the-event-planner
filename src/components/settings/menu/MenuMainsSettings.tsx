
import React from 'react';
import MenuSettingsBase from './MenuSettingsBase';
import { useMenuOptions } from '@/hooks/useMenuOptions';
import { Skeleton } from '@/components/ui/skeleton';

const MenuMainsSettings = () => {
  const { options, isLoading, saveMenuOptions } = useMenuOptions('main');
  
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
      title="Main Course Options"
      description="Configure main course options available for events"
      optionsData={options}
      category="main"
      onSave={saveMenuOptions}
    />
  );
};

export default MenuMainsSettings;

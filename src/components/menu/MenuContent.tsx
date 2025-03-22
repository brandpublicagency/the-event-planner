
import React from 'react';
import CustomMenuSection from './CustomMenuSection';
import StarterSection from './sections/StarterSection';
import MainCourseSectionContainer from './sections/MainCourseSection';
import DessertSectionContainer from './sections/DessertSectionContainer';
import AdditionalOptionsSectionContainer from './sections/AdditionalOptionsContainer';
import { Separator } from '@/components/ui/separator';
import { MenuState } from '@/hooks/menuStateTypes';

interface MenuContentProps {
  menuState: MenuState;
  onMenuStateChange: (field: string, value: any) => void;
  onCanapeSelection: (position: number, value: string) => void;
  saveMenuSelections?: () => Promise<void>;
}

const MenuContent = ({
  menuState,
  onMenuStateChange,
  onCanapeSelection
}: MenuContentProps) => {
  if (menuState.isCustomMenu) {
    return (
      <div className="space-y-4">
        <CustomMenuSection 
          customMenuDetails={menuState.customMenuDetails} 
          onCustomMenuDetailsChange={value => {
            onMenuStateChange('customMenuDetails', value);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-2">
      <Separator className="h-[0.5px] bg-zinc-200 mb-6 mt-1 print:hidden" />
      
      <StarterSection
        menuState={menuState}
        onMenuStateChange={onMenuStateChange}
        onCanapeSelection={onCanapeSelection}
      />

      <MainCourseSectionContainer
        menuState={menuState}
        onMenuStateChange={onMenuStateChange}
      />

      <DessertSectionContainer
        menuState={menuState}
        onMenuStateChange={onMenuStateChange}
      />

      <AdditionalOptionsSectionContainer
        menuState={menuState}
        onMenuStateChange={onMenuStateChange}
      />
    </div>
  );
};

export default MenuContent;

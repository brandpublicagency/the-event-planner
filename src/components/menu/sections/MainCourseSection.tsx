
import React from 'react';
import MainCourseSection from '../MainCourseSection';

interface MainCourseSectionContainerProps {
  menuState: any;
  onMenuStateChange: (field: string, value: any) => void;
}

const MainCourseSectionContainer: React.FC<MainCourseSectionContainerProps> = ({
  menuState,
  onMenuStateChange
}) => {
  return (
    <div className="space-y-4 menu-section">
      <div>
        <h3 className="font-semibold text-base mb-3 text-zinc-900 section-header">Main Course</h3>
        <MainCourseSection 
          selectedMainCourse={menuState.mainCourseType} 
          buffetMeatSelections={menuState.buffetMeatSelections} 
          buffetVegetableSelections={menuState.buffetVegetableSelections} 
          buffetStarchSelections={menuState.buffetStarchSelections} 
          buffetSaladSelection={menuState.buffetSaladSelection} 
          karooMeatSelection={menuState.karooMeatSelection} 
          karooStarchSelection={menuState.karooStarchSelection || []} 
          karooVegetableSelections={menuState.karooVegetableSelections} 
          karooSaladSelection={menuState.karooSaladSelection} 
          platedMainSelection={menuState.platedMainSelection} 
          platedSaladSelection={menuState.platedSaladSelection} 
          onMainCourseChange={value => {
            onMenuStateChange('mainCourseType', value);
            onMenuStateChange('buffetMeatSelections', []);
            onMenuStateChange('buffetVegetableSelections', []);
            onMenuStateChange('buffetStarchSelections', []);
            onMenuStateChange('buffetSaladSelection', '');
            onMenuStateChange('karooMeatSelection', '');
            onMenuStateChange('karooStarchSelection', []);
            onMenuStateChange('karooVegetableSelections', []);
            onMenuStateChange('karooSaladSelection', '');
            onMenuStateChange('platedMainSelection', '');
            onMenuStateChange('platedSaladSelection', '');
          }} 
          onBuffetMeatSelectionsChange={value => onMenuStateChange('buffetMeatSelections', value)} 
          onBuffetVegetableSelectionsChange={value => onMenuStateChange('buffetVegetableSelections', value)} 
          onBuffetStarchSelectionsChange={value => onMenuStateChange('buffetStarchSelections', value)} 
          onBuffetSaladSelectionChange={value => onMenuStateChange('buffetSaladSelection', value)} 
          onKarooMeatSelectionChange={value => onMenuStateChange('karooMeatSelection', value)} 
          onKarooStarchSelectionChange={value => onMenuStateChange('karooStarchSelection', value)} 
          onKarooVegetableSelectionsChange={value => onMenuStateChange('karooVegetableSelections', value)} 
          onKarooSaladSelectionChange={value => onMenuStateChange('karooSaladSelection', value)} 
          onPlatedMainSelectionChange={value => onMenuStateChange('platedMainSelection', value)} 
          onPlatedSaladSelectionChange={value => onMenuStateChange('platedSaladSelection', value)} 
        />
      </div>
    </div>
  );
};

export default MainCourseSectionContainer;

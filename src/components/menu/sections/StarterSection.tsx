
import React from 'react';
import StarterTypeSelect from '../StarterTypeSelect';
import CanapeSection from '../CanapeSection';
import PlatedStarterSection from '../PlatedStarterSection';

interface StarterSectionProps {
  menuState: any;
  onMenuStateChange: (field: string, value: any) => void;
  onCanapeSelection: (position: number, value: string) => void;
}

const StarterSection: React.FC<StarterSectionProps> = ({
  menuState,
  onMenuStateChange,
  onCanapeSelection
}) => {
  return (
    <div className="space-y-4 menu-section">
      <div>
        <h3 className="font-semibold text-base mb-3 text-zinc-900 section-header">Arrival & Starter</h3>
        <StarterTypeSelect 
          selectedStarterType={menuState.selectedStarterType} 
          onStarterTypeChange={value => {
            onMenuStateChange('selectedStarterType', value);
            onMenuStateChange('selectedCanapePackage', '');
            onMenuStateChange('selectedCanapes', []);
            onMenuStateChange('selectedPlatedStarter', '');
          }} 
        />
      </div>

      {menuState.selectedStarterType === 'canapes' && (
        <div>
          <CanapeSection 
            selectedCanapePackage={menuState.selectedCanapePackage} 
            selectedCanapes={menuState.selectedCanapes} 
            onCanapePackageChange={value => {
              onMenuStateChange('selectedCanapePackage', value);
              onMenuStateChange('selectedCanapes', []);
            }} 
            onCanapeSelection={onCanapeSelection} 
          />
        </div>
      )}

      {menuState.selectedStarterType === 'plated' && (
        <div>
          <PlatedStarterSection 
            selectedPlatedStarter={menuState.selectedPlatedStarter} 
            onPlatedStarterChange={value => {
              onMenuStateChange('selectedPlatedStarter', value);
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default StarterSection;

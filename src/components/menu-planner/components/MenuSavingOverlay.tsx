
import React from 'react';

interface MenuSavingOverlayProps {
  isVisible: boolean;
}

const MenuSavingOverlay: React.FC<MenuSavingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/5 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white p-4 rounded-md shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          <p>Saving menu...</p>
        </div>
      </div>
    </div>
  );
};

export default MenuSavingOverlay;

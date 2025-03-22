
import React from 'react';

interface MenuPlannerErrorProps {
  error: string;
}

const MenuPlannerError: React.FC<MenuPlannerErrorProps> = ({ error }) => {
  return (
    <div className="mt-4 print:mt-0">
      <div className="py-6">
        <div className="text-red-600 text-center animate-in fade-in slide-in-from-top-4">
          {error}
          <div className="mt-2">
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Refresh page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPlannerError;

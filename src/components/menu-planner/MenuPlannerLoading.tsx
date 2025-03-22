
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface MenuPlannerLoadingProps {
  loadingProgress: number;
}

const MenuPlannerLoading: React.FC<MenuPlannerLoadingProps> = ({ loadingProgress }) => {
  return (
    <div className="mt-4 print:mt-0">
      <div className="py-6 space-y-4">
        <div className="text-center animate-pulse mb-2">Loading menu data...</div>
        <Progress 
          value={loadingProgress} 
          className="w-full max-w-md mx-auto h-2"
          aria-label="Loading progress"
        />
      </div>
    </div>
  );
};

export default MenuPlannerLoading;

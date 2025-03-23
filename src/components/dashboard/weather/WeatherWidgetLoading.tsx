
import React from 'react';
import { Loader2 } from "lucide-react";

const WeatherWidgetLoading: React.FC = () => {
  return (
    <div className="w-full py-[5px]">
      <div className="w-full h-36 rounded-xl bg-blue-500 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    </div>
  );
};

export default WeatherWidgetLoading;

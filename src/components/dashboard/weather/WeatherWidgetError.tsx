
import React from 'react';

interface WeatherWidgetErrorProps {
  error: Error | null;
}

const WeatherWidgetError: React.FC<WeatherWidgetErrorProps> = ({ error }) => {
  console.error("Dashboard message error:", error);
  
  return (
    <div className="w-full py-[5px]">
      <div className="w-full rounded-xl bg-red-50 border border-red-200 p-4 text-red-800">
        Unable to load weather information. Please try again later.
      </div>
    </div>
  );
};

export default WeatherWidgetError;

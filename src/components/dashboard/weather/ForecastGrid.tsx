
import React from 'react';
import DayCard from './DayCard';
import { ForecastDay } from './forecastUtils';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  // Take only the first 8 days if more are provided
  const displayForecast = forecast.slice(0, 8);
  
  return (
    <div className="px-1 h-full w-full overflow-x-auto">
      <div className="flex w-full h-full items-center space-x-1">
        {displayForecast.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

export default ForecastGrid;

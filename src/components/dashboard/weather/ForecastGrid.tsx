
import React from 'react';
import DayCard from './DayCard';
import { ForecastDay } from './forecastUtils';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  // Take the first 8 time periods if more are provided (Now + 7 days)
  const displayForecast = forecast.slice(0, 8);
  
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between w-full ml-5 pl-5 border-l border-white/30">
        {displayForecast.map((day, index) => (
          <DayCard 
            key={index} 
            day={day} 
            index={index}
            isLast={index === displayForecast.length - 1} 
          />
        ))}
      </div>
    </div>
  );
};

export default ForecastGrid;

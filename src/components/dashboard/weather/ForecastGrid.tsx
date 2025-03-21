
import React from 'react';
import DayCard from './DayCard';
import { ForecastDay } from './forecastUtils';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  return (
    <div className="px-1 h-full">
      <div className="flex space-x-1 h-full items-center">
        {forecast.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

export default ForecastGrid;

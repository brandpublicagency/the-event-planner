
import React from 'react';
import DayCard from './DayCard';
import { ForecastDay } from './forecastUtils';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  return (
    <div className="px-2 h-full w-full">
      <div className="flex justify-between w-full h-full items-center">
        {forecast.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

export default ForecastGrid;

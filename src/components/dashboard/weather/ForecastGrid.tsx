
import React from 'react';
import DayCard from './DayCard';
import { ForecastDay } from './forecastUtils';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  return (
    <div className="mt-2">
      <div className="grid grid-cols-7 gap-1">
        {forecast.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

export default ForecastGrid;

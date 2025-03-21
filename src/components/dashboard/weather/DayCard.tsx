
import React from 'react';
import { ForecastDay } from './forecastUtils';
import WeatherIcon from './WeatherIcon';

interface DayCardProps {
  day: ForecastDay;
}

const DayCard: React.FC<DayCardProps> = ({ day }) => {
  return (
    <div className="day-card-hover flex flex-col items-center p-2 rounded-md transition-all duration-300">
      <div className="text-xs font-medium text-white mb-0.5">{day.day}</div>
      
      <WeatherIcon 
        condition={day.condition} 
        className="h-6 w-6 my-0.5" 
      />
      
      <div className="flex items-center space-x-1 text-2xs">
        <span className="text-white">{Math.round(day.high)}°</span>
        <span className="text-white/60">{Math.round(day.low)}°</span>
      </div>
    </div>
  );
};

export default DayCard;

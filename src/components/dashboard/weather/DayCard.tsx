
import React from 'react';
import { ForecastDay } from './forecastUtils';
import WeatherIcon from './WeatherIcon';
import { Droplets } from 'lucide-react';

interface DayCardProps {
  day: ForecastDay;
}

const DayCard: React.FC<DayCardProps> = ({ day }) => {
  // For forecast days, we'll determine if we should show night icons
  // based on whether we're displaying evening/night hours
  const currentHour = new Date().getHours();
  const isCurrentlyNight = currentHour >= 19 || currentHour < 6;
  
  // Determine if this is today to show current conditions for today vs. forecast for future days
  const isToday = day.day === 'Today';
  
  return (
    <div className="day-card-hover flex flex-col items-center p-2 py-4 rounded-md transition-all duration-300 min-w-[60px] flex-1">
      <div className="text-xs font-medium text-white mb-0.5">{day.day}</div>
      
      <WeatherIcon 
        condition={day.condition} 
        className="h-6 w-6 my-0.5"
        isNight={isToday && isCurrentlyNight} 
      />
      
      <div className="flex items-center space-x-1 text-2xs">
        <span className="text-white">{Math.round(day.high)}°</span>
        <span className="text-white/60">{Math.round(day.low)}°</span>
      </div>
      
      {/* Rain chance indicator */}
      <div className="flex items-center mt-1 text-2xs text-blue-300">
        <Droplets className="h-3 w-3 mr-0.5" />
        <span>{day.rainChance}%</span>
      </div>
    </div>
  );
};

export default DayCard;

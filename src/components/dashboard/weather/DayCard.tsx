
import React, { useState } from 'react';
import { Droplets, Wind, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import WeatherIcon from './WeatherIcon';
import { ForecastDay } from './forecastUtils';

interface DayCardProps {
  day: ForecastDay;
}

const DayCard: React.FC<DayCardProps> = ({ day }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const dayName = dateFormatter.format(day.date);
  
  const getUvColor = (uv: number) => {
    if (uv <= 2) return 'bg-green-400';
    if (uv <= 5) return 'bg-yellow-400';
    if (uv <= 7) return 'bg-orange-400';
    return 'bg-red-500';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex flex-col items-center justify-center p-2 rounded-md transition-all duration-300 day-card-hover"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="text-xs font-medium mb-1 text-white">{dayName}</span>
            <WeatherIcon condition={day.condition} className="h-10 w-10 mb-1" />
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-white">{day.high}°</span>
              <span className="text-white/70">{day.low}°</span>
            </div>
            <Badge variant="outline" className="mt-1 text-[10px] px-1 bg-white/10 text-white border-white/20">
              {day.rainChance}%
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-0 max-w-[220px] overflow-hidden rounded-md border border-white/20 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col">
            <div className="bg-white/10 py-2 px-3 border-b border-white/10">
              <h3 className="font-medium text-sm text-white">{dayName}</h3>
            </div>
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80">Temperature</span>
                <span className="text-sm font-medium text-white">
                  <span className="text-white">{day.high}°</span>
                  <span className="text-white/60 mx-1">|</span>
                  <span className="text-white/70">{day.low}°</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80">Chance of Rain</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-blue-400" 
                      style={{ width: `${day.rainChance}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-white">{day.rainChance}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-white">{day.humidity}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-gray-300" />
                  <span className="text-xs text-white">{day.wind} km/h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <div className="flex items-center gap-1">
                    <div className={`w-4 h-2 rounded-full ${getUvColor(day.uv)}`}></div>
                    <span className="text-xs text-white">UV {day.uv}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DayCard;

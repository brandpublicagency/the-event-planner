
import React from 'react';
import { Droplets, Wind, Sun } from "lucide-react";

interface WeatherDetailsProps {
  weatherData: {
    humidity?: string | number;
    wind_speed?: string | number;
    uv?: string | number;
  }
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData }) => {
  return (
    <div className="flex items-center space-x-4 mt-1">
      <div className="flex items-center space-x-1">
        <Droplets className="h-3 w-3 text-blue-200" />
        <span className="text-xs text-white">{weatherData.humidity || '40'}%</span>
      </div>
      <div className="flex items-center space-x-1">
        <Wind className="h-3 w-3 text-white/70" />
        <span className="text-xs text-white">{weatherData.wind_speed || '10'} km/h</span>
      </div>
      <div className="flex items-center space-x-1">
        <Sun className="h-3 w-3 text-amber-300" />
        <span className="text-xs text-white">UV {weatherData.uv || '4'}</span>
      </div>
    </div>
  );
};

export default WeatherDetails;

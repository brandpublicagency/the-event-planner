
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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Droplets className="h-4 w-4 text-blue-200" />
        <span className="text-sm text-white">{weatherData.humidity || '40'}%</span>
      </div>
      <div className="flex items-center gap-2">
        <Wind className="h-4 w-4 text-white/70" />
        <span className="text-sm text-white">{weatherData.wind_speed || '10'} km/h</span>
      </div>
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-amber-300" />
        <span className="text-sm text-white">UV {weatherData.uv || '4'}</span>
      </div>
    </div>
  );
};

export default WeatherDetails;

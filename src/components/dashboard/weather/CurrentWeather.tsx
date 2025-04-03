
import React from 'react';
import WeatherIcon from './WeatherIcon';
import WeatherDetails from './WeatherDetails';
import { Droplets } from 'lucide-react';

interface CurrentWeatherProps {
  weatherData: {
    temp?: number;
    condition?: string;
    description?: string;
    location?: string;
    humidity?: string | number;
    wind_speed?: string | number;
    uv?: string | number;
    rainChance?: number;
    icon?: string;
  } | null;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
  // Debug logging to check what data we're receiving
  console.log("Current weather data:", weatherData);
  
  // Handle null weather data with default values
  const safeData = weatherData || {
    temp: 18,
    condition: 'Clear',
    description: 'clear skies',
    location: 'Your Location',
    humidity: 50,
    wind_speed: 10,
    rainChance: 0
  };
  
  // Ensure rainChance is a number
  const rainChance = typeof safeData.rainChance === 'number' ? safeData.rainChance : 0;
  
  // Determine if it's night time based on current hour or icon
  const currentHour = new Date().getHours();
  const isNight = safeData.icon ? 
                 safeData.icon.endsWith('n') : 
                 (currentHour >= 19 || currentHour < 6);
  
  return (
    <div className="flex flex-col p-3 pr-4 border-r border-white/20">
      <div className="flex items-center space-x-3">
        <WeatherIcon 
          condition={safeData.condition}
          customIcon={safeData.icon}
          className="h-8 w-8"
          isNight={isNight}
        />
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white">
              {Math.round(safeData.temp || 0)}°C
            </h2>
            <span className="text-xs text-white/80 capitalize">
              {safeData.description || safeData.condition || 'Clear'}
            </span>
          </div>
          
          {/* Rain chance indicator */}
          <div className="flex items-center text-xs text-blue-300 mt-0.5">
            <Droplets className="h-3.5 w-3.5 mr-1" />
            <span>{rainChance}% chance of rain</span>
          </div>
        </div>
      </div>
      
      <WeatherDetails weatherData={safeData} />
    </div>
  );
};

export default CurrentWeather;

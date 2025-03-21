
import React from 'react';
import WeatherIcon from './WeatherIcon';
import WeatherDetails from './WeatherDetails';

interface CurrentWeatherProps {
  weatherData: {
    temp?: number;
    condition?: string;
    description?: string;
    location?: string;
    humidity?: string | number;
    wind_speed?: string | number;
    uv?: string | number;
  } | null;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
  // Debug logging to check what data we're receiving
  console.log("Current weather data:", weatherData);
  
  // Handle null weather data with default values
  const safeData = weatherData || {
    temp: 25,
    condition: 'Clear',
    description: 'clear skies',
    location: 'Your Location',
    humidity: 50,
    wind_speed: 10,
  };
  
  // Determine if it's night time (between 7PM and 6AM)
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 19 || currentHour < 6;
  
  return (
    <div className="flex flex-col p-3 pr-4 border-r border-white/20">
      <div className="flex items-center space-x-3">
        <WeatherIcon 
          condition={safeData.condition}
          className="h-8 w-8"
          isNight={isNight}
        />
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold text-white">
            {Math.round(safeData.temp || 0)}°C
          </h2>
          <span className="text-xs text-white/80 capitalize">
            {safeData.description || safeData.condition || 'Clear'}
          </span>
        </div>
      </div>
      
      <WeatherDetails weatherData={safeData} />
    </div>
  );
};

export default CurrentWeather;

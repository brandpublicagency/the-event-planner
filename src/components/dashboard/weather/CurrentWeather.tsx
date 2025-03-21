
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
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="mr-4">
          <WeatherIcon 
            condition={safeData.condition}
            className="h-16 w-16" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {Math.round(safeData.temp || 0)}°C
          </h2>
          <p className="text-white/80 capitalize">
            {safeData.description || safeData.condition || 'Clear'}
          </p>
          <p className="text-sm text-white/60">
            {safeData.location || 'Your Location'}
          </p>
        </div>
      </div>
      
      <WeatherDetails weatherData={safeData} />
    </div>
  );
};

export default CurrentWeather;

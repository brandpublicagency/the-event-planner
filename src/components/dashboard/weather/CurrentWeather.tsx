
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
  }
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="mr-4">
          <WeatherIcon 
            condition={weatherData.condition}
            className="h-16 w-16" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {Math.round(weatherData.temp || 0)}°C
          </h2>
          <p className="text-white/80 capitalize">
            {weatherData.description || weatherData.condition}
          </p>
          <p className="text-sm text-white/60">
            {weatherData.location || 'Your Location'}
          </p>
        </div>
      </div>
      <WeatherDetails weatherData={weatherData} />
    </div>
  );
};

export default CurrentWeather;


import React from 'react';
import { format } from 'date-fns';
import { MapPin, CloudRain, Cloud, CloudSnow, CloudLightning, Sun, CloudFog } from 'lucide-react';

interface WeatherCardProps {
  date?: string;
  location?: string;
  lowTemp?: number;
  highTemp?: number;
  chanceOfRain?: string;
  weatherData?: any;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  date,
  location = "Warm Karoo, Bloemfontein",
  lowTemp,
  highTemp,
  chanceOfRain = "HIGH",
  weatherData
}) => {
  // Use provided props or extract from weatherData if available
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const displayDate = date || format(tomorrow, 'EEEE, d MMMM yyyy').toUpperCase();
  const displayLowTemp = lowTemp || (weatherData?.temp ? Math.max(weatherData.temp - 10, 5) : 9);
  const displayHighTemp = highTemp || (weatherData?.temp || 27);
  
  return (
    <div className="flex-shrink-0 w-full md:w-auto overflow-hidden rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-md">
      <div className="relative h-full p-4 flex flex-row items-center justify-between w-full md:w-80">
        {/* Left side - temperatures */}
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline">
            <span className="text-6xl font-bold">{displayLowTemp}</span>
            <span className="text-xl ml-1">°</span>
            <span className="text-sm ml-1 opacity-80">Low</span>
          </div>
          <div className="flex items-baseline mt-2">
            <span className="text-6xl font-bold">{displayHighTemp}</span>
            <span className="text-xl ml-1">°</span>
            <span className="text-sm ml-1 opacity-80">High</span>
          </div>
        </div>
        
        {/* Right side - date, location, rain chance */}
        <div className="flex flex-col items-end justify-between h-full">
          <div className="text-xs mb-2">{displayDate}</div>
          <div className="flex items-center mb-3 text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs opacity-80">Chance of rain:</span>
            <span className="font-bold">{chanceOfRain}</span>
          </div>
        </div>
        
        {/* Sun icon overlay */}
        <div className="absolute top-2 right-4 opacity-20">
          <div className="h-16 w-16 rounded-full bg-yellow-300"></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

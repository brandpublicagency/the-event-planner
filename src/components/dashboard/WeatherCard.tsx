
import React from 'react';
import { format } from 'date-fns';
import { MapPin, CloudRain, Cloud, CloudSnow, CloudLightning, Sun, CloudFog, Droplet } from 'lucide-react';

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
  
  // Determine time-based gradient based on current hour
  const currentHour = new Date().getHours();
  let gradientClass = "";
  
  // Early Morning (5:00 AM - 7:59 AM)
  if (currentHour >= 5 && currentHour < 8) {
    gradientClass = "bg-gradient-to-r from-gray-400 to-indigo-300";
  } 
  // Morning (8:00 AM - 11:59 AM)
  else if (currentHour >= 8 && currentHour < 12) {
    gradientClass = "bg-gradient-to-r from-blue-200 to-sky-300";
  } 
  // Midday (12:00 PM - 3:59 PM)
  else if (currentHour >= 12 && currentHour < 16) {
    gradientClass = "bg-gradient-to-r from-blue-300 to-cyan-400";
  } 
  // Late Afternoon (4:00 PM - 6:59 PM)
  else if (currentHour >= 16 && currentHour < 19) {
    gradientClass = "bg-gradient-to-r from-amber-200 to-gray-400";
  } 
  // Evening (7:00 PM - 9:59 PM)
  else if (currentHour >= 19 && currentHour < 22) {
    gradientClass = "bg-gradient-to-r from-gray-500 to-purple-400";
  } 
  // Night (10:00 PM - 4:59 AM)
  else {
    gradientClass = "bg-gradient-to-r from-gray-700 to-blue-800";
  }
  
  // Determine appropriate weather icon based on weather data or chance of rain
  const getWeatherIcon = () => {
    if (weatherData?.description) {
      const desc = weatherData.description.toLowerCase();
      if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
        return <CloudRain className="h-8 w-8 opacity-80" />;
      } else if (desc.includes('snow')) {
        return <CloudSnow className="h-8 w-8 opacity-80" />;
      } else if (desc.includes('lightning') || desc.includes('thunder')) {
        return <CloudLightning className="h-8 w-8 opacity-80" />;
      } else if (desc.includes('fog') || desc.includes('mist')) {
        return <CloudFog className="h-8 w-8 opacity-80" />;
      } else if (desc.includes('cloud')) {
        return <Cloud className="h-8 w-8 opacity-80" />;
      } else {
        return <Sun className="h-8 w-8 opacity-80" />;
      }
    }
    
    // Default icon based on chance of rain if no weather data description
    if (chanceOfRain === "HIGH") {
      return <CloudRain className="h-8 w-8 opacity-80" />;
    } else if (chanceOfRain === "MEDIUM") {
      return <Cloud className="h-8 w-8 opacity-80" />;
    } else {
      return <Sun className="h-8 w-8 opacity-80" />;
    }
  };
  
  return (
    <div className={`flex-shrink-0 w-full md:w-auto overflow-hidden rounded-lg text-white shadow-md ${gradientClass}`}>
      <div className="relative h-full p-4 flex flex-row items-center justify-between w-full md:w-80">
        {/* Left side - temperatures and icon */}
        <div className="flex flex-col justify-center">
          <div className="flex items-start">
            <div className="mr-3">
              {getWeatherIcon()}
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-semibold">{displayHighTemp}</span>
                <span className="text-lg ml-1">°</span>
              </div>
              <div className="flex items-baseline mt-1">
                <span className="text-xl font-normal opacity-90">{displayLowTemp}</span>
                <span className="text-sm ml-1">°</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - date, location, rain chance */}
        <div className="flex flex-col items-end justify-between h-full">
          <div className="text-xs mb-2">{displayDate}</div>
          <div className="flex items-center mb-3 text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-xs">
            <Droplet className="h-3 w-3 mr-1" />
            <span>{chanceOfRain}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

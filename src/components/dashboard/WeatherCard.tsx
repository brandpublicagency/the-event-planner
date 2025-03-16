
import React from 'react';
import { MapPin, Droplet, Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudFog, Moon, Sunrise, Sunset } from 'lucide-react';

interface WeatherCardProps {
  date?: string;
  location?: string;
  lowTemp?: number;
  highTemp?: number;
  chanceOfRain?: string;
  weatherData?: any;
  // Optional props for customization
  className?: string;
  // Optional override for time-based styling (for demonstration)
  timeOverride?: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  date,
  location = "Warm Karoo, Bloemfontein",
  lowTemp,
  highTemp,
  chanceOfRain = "HIGH",
  weatherData,
  className = '',
  timeOverride,
}) => {
  // Use provided props or extract from weatherData if available
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const displayDate = date || format(tomorrow, 'EEEE, d MMMM yyyy').toUpperCase();
  const displayLowTemp = lowTemp || (weatherData?.temp ? Math.max(weatherData.temp - 10, 5) : 9);
  const displayHighTemp = highTemp || (weatherData?.temp || 27);
  
  // Determine time-based gradient based on current hour
  const currentHour = timeOverride !== undefined ? timeOverride : new Date().getHours();
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
  
  // Determine the weather icon to display based on time of day and weather conditions
  const getWeatherIcon = () => {
    // First check if we have weather data with description
    if (weatherData?.description) {
      const desc = weatherData.description.toLowerCase();
      if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
        return <CloudRain className="h-5 w-5" />;
      } else if (desc.includes('snow')) {
        return <CloudSnow className="h-5 w-5" />;
      } else if (desc.includes('lightning') || desc.includes('thunder')) {
        return <CloudLightning className="h-5 w-5" />;
      } else if (desc.includes('fog') || desc.includes('mist')) {
        return <CloudFog className="h-5 w-5" />;
      } else if (desc.includes('cloud')) {
        return <Cloud className="h-5 w-5" />;
      }
    }
    
    // Fallback to time-based icons
    // Nighttime (7 PM - 5 AM)
    if (currentHour >= 19 || currentHour < 5) {
      return <Moon className="h-5 w-5" />;
    }
    // Early morning or late afternoon
    else if ((currentHour >= 5 && currentHour < 8) || (currentHour >= 16 && currentHour < 19)) {
      return chanceOfRain === "HIGH" ? <Cloud className="h-5 w-5" /> : 
             (currentHour < 12 ? <Sunrise className="h-5 w-5" /> : <Sunset className="h-5 w-5" />);
    }
    // Daytime
    else {
      return chanceOfRain === "HIGH" ? <Cloud className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
    }
  };
  
  // Determine the color for the chance of rain text
  const rainColorClass = 
    chanceOfRain === "HIGH" ? "text-white" :
    chanceOfRain === "MEDIUM" ? "text-yellow-100" : "text-green-100";

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${className}`}>
      <div className={`${gradientClass} text-white p-5 flex flex-col h-full`}>
        {/* Header section with date and location */}
        <div className="mb-3">
          <div className="uppercase font-medium tracking-wide text-sm">{displayDate}</div>
          <div className="flex items-center mt-1.5 text-xs text-white/90">
            <MapPin className="h-3 w-3 mr-1.5" />
            <span>{location}</span>
          </div>
        </div>
        
        {/* Temperature display section */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-md">
            <span className="text-xs text-white/80 mb-1">Low</span>
            <span className="text-4xl font-light">{displayLowTemp}°</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-md">
            <span className="text-xs text-white/80 mb-1">High</span>
            <span className="text-4xl font-light">{displayHighTemp}°</span>
          </div>
        </div>
        
        {/* Chance of rain indicator - bottom section */}
        <div className="mt-3 flex justify-between items-center">
          <div>
            <div className="text-xs uppercase tracking-wider font-medium text-white/80 mb-1">Chance of rain</div>
            <div className="flex items-center">
              <Droplet className="h-4 w-4 mr-2 text-white/70" />
              <span className={`font-semibold text-sm ${rainColorClass}`}>{chanceOfRain}</span>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-full p-2">
            {getWeatherIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;


import React from 'react';
import { format } from 'date-fns';
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
  
  // Get time period description for accessibility
  const getTimePeriodDescription = (hour: number) => {
    if (hour >= 5 && hour < 8) return "Early Morning";
    if (hour >= 8 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 16) return "Midday";
    if (hour >= 16 && hour < 19) return "Late Afternoon";
    if (hour >= 19 && hour < 22) return "Evening";
    return "Night";
  };

  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-sm ${className}`} 
      aria-label={`Weather for ${location}, ${getTimePeriodDescription(currentHour)}`}
    >
      <div className={`${gradientClass} text-white p-5 flex flex-col h-full relative`}>
        {/* Large weather icon in background */}
        <div className="absolute top-3 right-3 opacity-10">
          {getWeatherIcon()}
          <div className="h-24 w-24" />
        </div>
        
        {/* Header section with date and location */}
        <div className="mb-4 z-10">
          <div className="uppercase font-medium tracking-wide text-sm">{displayDate}</div>
          <div className="flex items-center mt-1.5 text-xs text-white/90">
            <MapPin className="h-3 w-3 mr-1.5" />
            <span>{location}</span>
          </div>
        </div>
        
        {/* Clear divider */}
        <div className="border-t border-white/10 my-2"></div>
        
        {/* Temperature display section */}
        <div className="grid grid-cols-2 gap-3 my-3 z-10">
          <div className="flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-md">
            <span className="text-xs text-white/80 mb-1">Low</span>
            <span className="text-4xl font-light">{displayLowTemp}°</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-md">
            <span className="text-xs text-white/80 mb-1">High</span>
            <span className="text-4xl font-light">{displayHighTemp}°</span>
          </div>
        </div>
        
        {/* Clear divider */}
        <div className="border-t border-white/10 my-2"></div>
        
        {/* Chance of rain indicator - bottom section */}
        <div className="mt-auto z-10">
          <div className="text-xs uppercase tracking-wider font-medium text-white/80 mb-1">Chance of rain</div>
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-2 text-white/70" />
            <span className={`font-semibold text-sm ${rainColorClass}`}>{chanceOfRain}</span>
          </div>
        </div>
        
        {/* Small weather icon indicator */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/20 rounded-full p-1.5">
          {getWeatherIcon()}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

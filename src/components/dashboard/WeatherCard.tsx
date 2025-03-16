
import React from 'react';
import { MapPin, Droplet, Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudFog, Moon, Sunrise, Sunset, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

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
  
  // Updated gradient classes with refined night-time styles
  let gradientStyle;
  
  // Late Evening (8:00 PM - 9:59 PM)
  if (currentHour >= 20 && currentHour < 22) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(75, 85, 99), rgb(51, 65, 85), rgb(55, 48, 163))"
    };
  }
  // Night (10:00 PM - 1:59 AM)
  else if (currentHour >= 22 || currentHour < 2) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55), rgb(51, 65, 85), rgb(17, 24, 39))"
    };
  }
  // Deep Night (2:00 AM - 3:59 AM)
  else if (currentHour >= 2 && currentHour < 4) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(17, 24, 39), rgb(30, 41, 59), rgb(30, 27, 75))"
    };
  }
  // Pre-Dawn (4:00 AM - 5:59 AM)
  else if (currentHour >= 4 && currentHour < 6) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(31, 41, 55), rgb(51, 65, 85), rgb(49, 46, 129))"
    };
  }
  // Early Morning (6:00 AM - 7:59 AM)
  else if (currentHour >= 6 && currentHour < 8) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(209, 213, 219), rgb(203, 213, 225), rgb(199, 210, 254))"
    };
  } 
  // Morning (8:00 AM - 11:59 AM)
  else if (currentHour >= 8 && currentHour < 12) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(219, 234, 254), rgb(186, 230, 253), rgb(224, 231, 255))"
    };
  } 
  // Midday (12:00 PM - 3:59 PM)
  else if (currentHour >= 12 && currentHour < 16) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(186, 230, 253), rgb(191, 219, 254), rgb(207, 250, 254))"
    };
  } 
  // Late Afternoon (4:00 PM - 7:59 PM)
  else if (currentHour >= 16 && currentHour < 20) {
    gradientStyle = {
      background: "linear-gradient(135deg, rgb(254, 243, 199), rgb(255, 237, 213), rgb(219, 234, 254))"
    };
  }
  
  // Fallback Tailwind classes for compatibility
  let fallbackGradientClass = "";
  
  // Late Evening (8:00 PM - 9:59 PM)
  if (currentHour >= 20 && currentHour < 22) {
    fallbackGradientClass = "bg-gradient-to-r from-gray-600 via-slate-600 to-indigo-800";
  }
  // Night (10:00 PM - 1:59 AM)
  else if (currentHour >= 22 || currentHour < 2) {
    fallbackGradientClass = "bg-gradient-to-r from-gray-800 via-slate-700 to-gray-900";
  }
  // Deep Night (2:00 AM - 3:59 AM)
  else if (currentHour >= 2 && currentHour < 4) {
    fallbackGradientClass = "bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-950";
  }
  // Pre-Dawn (4:00 AM - 5:59 AM)
  else if (currentHour >= 4 && currentHour < 6) {
    fallbackGradientClass = "bg-gradient-to-r from-gray-800 via-slate-700 to-indigo-900";
  }
  // Early Morning (6:00 AM - 7:59 AM)
  else if (currentHour >= 6 && currentHour < 8) {
    fallbackGradientClass = "bg-gradient-to-r from-gray-300 via-slate-300 to-indigo-200";
  } 
  // Morning (8:00 AM - 11:59 AM)
  else if (currentHour >= 8 && currentHour < 12) {
    fallbackGradientClass = "bg-gradient-to-r from-blue-100 via-sky-200 to-indigo-100";
  } 
  // Midday (12:00 PM - 3:59 PM)
  else if (currentHour >= 12 && currentHour < 16) {
    fallbackGradientClass = "bg-gradient-to-r from-sky-200 via-blue-200 to-cyan-100";
  } 
  // Late Afternoon (4:00 PM - 7:59 PM)
  else if (currentHour >= 16 && currentHour < 20) {
    fallbackGradientClass = "bg-gradient-to-r from-amber-100 via-orange-100 to-blue-100";
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
    
  // Calculate timestamp for when the weather data was last updated
  const getLastUpdated = () => {
    if (weatherData?.timestamp) {
      const updatedTime = new Date(weatherData.timestamp);
      return format(updatedTime, 'HH:mm');
    }
    return format(new Date(), 'HH:mm');
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm h-full ${className}`}>
      <div 
        className={`text-white p-3 flex flex-col h-full ${fallbackGradientClass}`} 
        style={gradientStyle}
      >
        {/* Header section with date, location, and weather icon */}
        <div className="mb-2 flex justify-between items-start">
          <div>
            <div className="uppercase font-medium tracking-wide text-sm">{displayDate}</div>
            <div className="flex items-center mt-1 text-xs">
              <div className="flex items-center text-white/90">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{location}</span>
              </div>
              {/* Moved last updated indicator here */}
              <div className="text-white/60 flex items-center ml-2 pl-2 border-l border-white/20">
                <RefreshCcw className="h-2.5 w-2.5 mr-1" />
                <span className="text-[10px]">Updated {getLastUpdated()}</span>
              </div>
            </div>
          </div>
          
          {/* Weather icon indicator - moved to top right */}
          <div className="bg-white/20 rounded-full p-1.5">
            {getWeatherIcon()}
          </div>
        </div>
        
        {/* Temperature and rain info section in a single row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-md">
            <span className="text-xs text-white/80 mb-1">Low</span>
            <span className="text-3xl font-light">{displayLowTemp}°</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-md">
            <span className="text-xs text-white/80 mb-1">High</span>
            <span className="text-3xl font-light">{displayHighTemp}°</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-md">
            <div className="flex items-center mb-1">
              <Droplet className="h-3 w-3 mr-1 text-white/80" />
              <span className="text-xs text-white/80">Rain</span>
            </div>
            <span className={`text-sm font-semibold ${rainColorClass}`}>{chanceOfRain}</span>
          </div>
        </div>
        
        {/* Removed the last updated section from here */}
      </div>
    </div>
  );
};

export default WeatherCard;

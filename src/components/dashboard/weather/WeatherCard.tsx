
import React from 'react';
import { MapPin, Droplet, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { getWeatherGradientStyles } from './weatherGradientStyles';
import { WeatherIcon } from './WeatherIcon';
import { WeatherStatCard } from './WeatherStatCard';
import { motion } from 'framer-motion';

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
  
  const { gradientStyle, fallbackGradientClass } = getWeatherGradientStyles(currentHour);
  
  // Calculate timestamp for when the weather data was last updated
  const getLastUpdated = () => {
    if (weatherData?.timestamp) {
      const updatedTime = new Date(weatherData.timestamp);
      return format(updatedTime, 'HH:mm');
    }
    return format(new Date(), 'HH:mm');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl overflow-hidden shadow-lg h-full transform transition-all hover:shadow-xl duration-300 ${className}`}
    >
      <div 
        className={`text-white p-4 flex flex-col h-full ${fallbackGradientClass}`} 
        style={gradientStyle}
      >
        {/* Header section with date, location, and weather icon */}
        <div className="mb-3 flex justify-between items-start">
          <div>
            <div className="uppercase font-semibold tracking-wide text-sm">{displayDate}</div>
            <div className="flex items-center mt-1.5 text-xs">
              <div className="flex items-center text-white/90">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="font-medium">{location}</span>
              </div>
              {/* Last updated indicator */}
              <div className="text-white/70 flex items-center ml-3 pl-2 border-l border-white/30">
                <RefreshCcw className="h-3 w-3 mr-1 animate-spin-slow" />
                <span className="text-[10px] font-medium">Updated {getLastUpdated()}</span>
              </div>
            </div>
          </div>
          
          {/* Weather icon indicator */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-white/30 rounded-full p-2 shadow-md"
          >
            <WeatherIcon weatherData={weatherData} currentHour={currentHour} chanceOfRain={chanceOfRain} />
          </motion.div>
        </div>
        
        {/* Temperature and rain info section in a single row */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          <WeatherStatCard label="Low" value={`${displayLowTemp}°`} />
          <WeatherStatCard label="High" value={`${displayHighTemp}°`} />
          <WeatherStatCard 
            label={<div className="flex items-center">
              <Droplet className="h-3 w-3 mr-1 text-sky-300" />
              <span>Rain</span>
            </div>} 
            value={chanceOfRain} 
            className={chanceOfRain === "HIGH" ? "text-sky-300" : chanceOfRain === "MEDIUM" ? "text-sky-200" : "text-white"} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;

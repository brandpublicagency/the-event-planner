
import React from 'react';
import { MapPin, Droplet, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { getWeatherGradientStyles } from './weatherGradientStyles';
import WeatherIcon from './WeatherIcon';
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
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const displayDate = date || format(tomorrow, 'EEEE, d MMMM yyyy').toUpperCase();
  const displayLowTemp = lowTemp || (weatherData?.temp ? Math.max(weatherData.temp - 10, 5) : 9);
  const displayHighTemp = highTemp || (weatherData?.temp || 27);
  
  const currentHour = timeOverride !== undefined ? timeOverride : new Date().getHours();
  
  // Convert currentHour to string before passing to getWeatherGradientStyles
  const timeOfDay = typeof currentHour === 'number' ? 
    (currentHour >= 5 && currentHour < 12 ? 'morning' : 
     currentHour >= 12 && currentHour < 18 ? 'day' : 'night') : 'day';
  
  const { gradientStyle, fallbackGradientClass } = getWeatherGradientStyles(timeOfDay);
  
  const getLastUpdated = () => {
    if (weatherData?.timestamp) {
      const updatedTime = new Date(weatherData.timestamp);
      return format(updatedTime, 'HH:mm');
    }
    return format(new Date(), 'HH:mm');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl overflow-hidden h-full transform transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}
    >
      <div 
        className={`text-white p-5 flex flex-col h-full ${fallbackGradientClass.replace(/\/40/g, '/70')}`} 
        style={{ background: gradientStyle.background }}
      >
        <div className="mb-4 flex justify-between items-start">
          <div>
            <div className="uppercase font-bold tracking-wide text-sm text-white">
              {displayDate}
            </div>
            <div className="flex items-center mt-2 text-xs">
              <div className="flex items-center text-white">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-sky-200" />
                <span className="font-semibold">{location}</span>
              </div>
              <div className="text-white flex items-center ml-3 pl-2 border-l border-white/60">
                <RefreshCcw className="h-3 w-3 mr-1.5 animate-spin-slow text-sky-200" />
                <span className="text-[10px] font-medium">Updated {getLastUpdated()}</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-white/40 rounded-full p-2.5 shadow-lg"
            style={{ boxShadow: '0 0 15px rgba(255,255,255,0.3)' }}
          >
            <WeatherIcon 
              condition={weatherData?.condition} 
              className="h-8 w-8 text-white"
            />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-2">
          <WeatherStatCard label="Low" value={`${displayLowTemp}°`} />
          <WeatherStatCard label="High" value={`${displayHighTemp}°`} />
          <WeatherStatCard 
            label={<div className="flex items-center">
              <Droplet className="h-3.5 w-3.5 mr-1.5 text-sky-300" />
              <span>Rain</span>
            </div>} 
            value={chanceOfRain} 
            className={chanceOfRain === "HIGH" ? "text-sky-300 font-extrabold" : chanceOfRain === "MEDIUM" ? "text-sky-200 font-bold" : "text-white font-bold"} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;

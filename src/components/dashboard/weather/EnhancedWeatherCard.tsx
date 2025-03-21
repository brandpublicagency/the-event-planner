
import React from 'react';
import { Droplet, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { getWeatherGradientStyles } from './weatherGradientStyles';
import { WeatherStatCard } from './WeatherStatCard';
import { motion } from 'framer-motion';
import WeatherCardHeader from './WeatherCardHeader';
import WeatherBackground from './WeatherBackground';

interface WeatherCardProps {
  date?: string;
  location?: string;
  lowTemp?: number;
  highTemp?: number;
  chanceOfRain?: string;
  weatherData?: any;
  className?: string;
  timeOverride?: number;
  weatherType?: string;
}

const EnhancedWeatherCard: React.FC<WeatherCardProps> = ({
  date,
  location = "Warm Karoo, Bloemfontein",
  lowTemp,
  highTemp,
  chanceOfRain = "LOW",
  weatherData,
  className = '',
  timeOverride,
  weatherType,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const displayLowTemp = lowTemp || (weatherData?.temp ? Math.max(weatherData.temp - 10, 5) : 9);
  const displayHighTemp = highTemp || (weatherData?.temp || 27);
  
  const currentHour = timeOverride !== undefined ? timeOverride : new Date().getHours();
  
  const { gradientStyle, fallbackGradientClass } = getWeatherGradientStyles(currentHour, weatherType);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`rounded-xl overflow-hidden h-full transform transition-all duration-300 shadow-lg hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-300 ${className}`}
      style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}
      tabIndex={0}
      aria-label={`Weather forecast for ${location}, high temperature ${displayHighTemp}°, low temperature ${displayLowTemp}°, ${weatherType || weatherData?.description || ''}`}
    >
      <div 
        className={`text-white p-5 flex flex-col h-full ${fallbackGradientClass}`} 
        style={{ background: gradientStyle.background }}
      >
        {/* Weather background animations */}
        <WeatherBackground weatherType={weatherType || weatherData?.description} />
        
        {/* Header section */}
        <WeatherCardHeader 
          date={date}
          location={location}
          weatherType={weatherType || weatherData?.condition}
        />
        
        {/* Stats section */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          <WeatherStatCard 
            label={<div className="flex items-center">
              <Thermometer className="h-3.5 w-3.5 mr-1 text-blue-200" />
              <span>Low</span>
            </div>} 
            value={`${displayLowTemp}°`} 
          />
          <WeatherStatCard 
            label={<div className="flex items-center">
              <Thermometer className="h-3.5 w-3.5 mr-1 text-orange-200" />
              <span>High</span>
            </div>} 
            value={`${displayHighTemp}°`} 
          />
          <WeatherStatCard 
            label={<div className="flex items-center">
              <Droplet className="h-3.5 w-3.5 mr-1 text-sky-300" />
              <span>Rain</span>
            </div>} 
            value={chanceOfRain} 
            className={chanceOfRain === "HIGH" ? "text-sky-300 font-extrabold" : chanceOfRain === "MEDIUM" ? "text-sky-200 font-bold" : "text-white/90 font-medium"} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedWeatherCard;

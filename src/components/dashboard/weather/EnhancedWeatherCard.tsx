import React from 'react';
import { MapPin, Droplet, Wind, Thermometer, Calendar } from 'lucide-react';
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
  // Optional weather type override
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
  
  const displayDate = date || format(tomorrow, 'EEEE, d MMMM yyyy').toUpperCase();
  const displayLowTemp = lowTemp || (weatherData?.temp ? Math.max(weatherData.temp - 10, 5) : 9);
  const displayHighTemp = highTemp || (weatherData?.temp || 27);
  
  const currentHour = timeOverride !== undefined ? timeOverride : new Date().getHours();
  
  const { gradientStyle, fallbackGradientClass } = getWeatherGradientStyles(currentHour, weatherType);

  const getWeatherBackground = () => {
    const type = weatherType?.toLowerCase() || weatherData?.description?.toLowerCase() || '';
    
    if (type.includes('rain') || type.includes('shower') || type.includes('drizzle')) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute h-10 w-0.5 bg-white/30 rounded-full"
              initial={{ y: -20, x: Math.random() * 100 + '%' }}
              animate={{ 
                y: ['0%', '100%'],
                opacity: [0.7, 0.3]
              }}
              transition={{ 
                duration: 0.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear"
              }}
            />
          ))}
        </div>
      );
    }
    
    if (type.includes('snow')) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute h-2 w-2 bg-white rounded-full opacity-70"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: -10
              }}
              animate={{ 
                y: ['0%', '100%'],
                x: [
                  `${Math.random() * 100}%`, 
                  `${Math.random() * 100 + 5}%`, 
                  `${Math.random() * 100 - 5}%`
                ],
                opacity: [0.8, 0.2]
              }}
              transition={{ 
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      );
    }
    
    if (type.includes('thunder') || type.includes('lightning')) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-yellow-300/70 rotate-12 opacity-0"
              style={{
                width: '3px',
                height: '60px',
                left: `${20 + Math.random() * 60}%`,
                top: '10%'
              }}
              animate={{ 
                opacity: [0, 0.9, 0],
                scaleY: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 5 + Math.random() * 10,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      );
    }
    
    if (type.includes('fog') || type.includes('mist') || type.includes('haze')) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-white/20 rounded-full"
              style={{
                width: `${80 + Math.random() * 100}px`,
                height: `${20 + Math.random() * 30}px`,
                left: `${-20 + Math.random() * 120}%`,
                top: `${10 + Math.random() * 80}%`
              }}
              animate={{ 
                x: ['-5%', '5%', '-5%'],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8 + Math.random() * 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      );
    }
    
    if (type.includes('wind')) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-white/10 rounded-sm"
              style={{
                width: `${30 + Math.random() * 70}px`,
                height: '2px',
                left: '-10%',
                top: `${10 + Math.random() * 80}%`
              }}
              animate={{ 
                x: ['-10%', '120%'],
                opacity: [0, 0.7, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      );
    }
    
    return null;
  };
  
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
        {getWeatherBackground()}
        
        <div className="mb-4 flex justify-between items-start relative z-10">
          <div>
            <div className="uppercase font-bold tracking-wide text-sm text-white/90">
              {displayDate}
            </div>
            <div className="flex items-center mt-2 text-xs">
              <div className="flex items-center text-white/90">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-sky-200" />
                <span className="font-semibold">{location}</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/30 backdrop-blur-sm rounded-full p-2.5 shadow-lg"
            style={{ boxShadow: '0 0 15px rgba(255,255,255,0.2)' }}
          >
            <WeatherIcon 
              condition={weatherType || weatherData?.condition}
              className="h-8 w-8 text-white"
            />
          </motion.div>
        </div>
        
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


import React from 'react';
import WeatherIcon from './WeatherIcon';
import { motion } from 'framer-motion';

interface DayCardProps {
  day: {
    day: string;
    condition: string;
    icon: string;
    temp?: string;
    high?: number;
    low?: number;
  };
  index?: number;
}

const DayCard: React.FC<DayCardProps> = ({ day, index = 0 }) => {
  const isSunset = day.day === 'Sunset' || day.condition === 'Sunset';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col items-center justify-center text-white text-center px-1"
    >
      <div className="text-xs font-medium mb-1">{day.day}</div>
      
      <div className="my-1">
        {isSunset ? (
          <div className="flex items-center justify-center w-6 h-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V5M5.6 5.6L7 7M3 12H5M5.6 18.4L7 17M21 12H19M18.4 18.4L17 17M18.4 5.6L17 7M12 19V21M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ) : (
          <WeatherIcon 
            condition={day.condition} 
            customIcon={day.icon} 
            className="w-6 h-6"
          />
        )}
      </div>
      
      {day.temp && (
        <div className="text-xs font-semibold">{day.temp}</div>
      )}
      
      {(day.high !== undefined && day.low !== undefined) && (
        <div className="text-xs text-white/80">
          <span className="font-medium">{day.high}°</span>
          <span className="mx-1 opacity-60">|</span>
          <span className="opacity-80">{day.low}°</span>
        </div>
      )}
    </motion.div>
  );
};

export default DayCard;

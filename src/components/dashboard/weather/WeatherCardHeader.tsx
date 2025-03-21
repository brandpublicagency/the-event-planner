
import React from 'react';
import { MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';

interface WeatherCardHeaderProps {
  date?: string;
  location?: string;
  weatherType?: string;
}

const WeatherCardHeader: React.FC<WeatherCardHeaderProps> = ({ 
  date, 
  location = "Warm Karoo, Bloemfontein", 
  weatherType 
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const displayDate = date || format(tomorrow, 'EEEE, d MMMM yyyy').toUpperCase();

  return (
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
          condition={weatherType}
          className="h-8 w-8 text-white"
        />
      </motion.div>
    </div>
  );
};

export default WeatherCardHeader;

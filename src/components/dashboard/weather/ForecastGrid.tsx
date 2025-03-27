
import React from 'react';
import DayCard from './DayCard';
import { ForecastDay } from './forecastUtils';
import { motion } from 'framer-motion';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  // Take only the first 5 time periods if more are provided
  const displayForecast = forecast.slice(0, 5);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-row justify-between w-full">
        {displayForecast.map((day, index) => (
          <DayCard key={index} day={day} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastGrid;

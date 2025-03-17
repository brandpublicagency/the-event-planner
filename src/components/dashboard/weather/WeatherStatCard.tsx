
import React, { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface WeatherStatCardProps {
  label: ReactNode;
  value: string;
  className?: string;
}

export const WeatherStatCard: React.FC<WeatherStatCardProps> = ({
  label,
  value,
  className = ''
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const hasChanged = prevValue !== value;

  useEffect(() => {
    // Add a small delay before updating the previous value
    // to allow the animation to complete
    if (hasChanged) {
      const timer = setTimeout(() => {
        setPrevValue(value);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [value, hasChanged]);

  return (
    <div className="flex flex-col items-center justify-center p-3 backdrop-blur-sm rounded-lg transition-all hover:scale-105 duration-300 bg-[#000a0e]/[0.15]">
      <span className="text-xs sm:text-sm md:text-sm text-white/90 mb-1 font-medium">{label}</span>
      <motion.span 
        key={value} 
        initial={hasChanged ? {
          opacity: 0,
          y: -8
        } : false} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.4,
          ease: 'easeOut'
        }} 
        className={cn("text-sm sm:text-base md:text-lg font-bold text-gray-300", className)}
      >
        {value}
      </motion.span>
    </div>
  );
};

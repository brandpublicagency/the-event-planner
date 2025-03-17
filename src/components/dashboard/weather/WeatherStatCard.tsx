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
  return <div className="flex flex-col items-center justify-center p-2 backdrop-blur-sm rounded-md transition-colors bg-[#000a0e]/[0.23]">
      <span className="text-xs sm:text-xs md:text-sm text-white/80 mb-1">{label}</span>
      <motion.span key={value} initial={hasChanged ? {
      opacity: 0,
      y: -8
    } : false} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.4,
      ease: 'easeOut'
    }} className={cn("text-sm sm:text-sm md:text-base font-semibold text-gray-300", className)}>
        {value}
      </motion.span>
    </div>;
};
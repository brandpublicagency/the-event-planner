
import React from 'react';

interface WeatherBackgroundProps {
  weatherType?: string;
  todayOnly?: boolean;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = () => {
  // All animations removed, returning empty container
  return <div className="absolute inset-0 z-0 pointer-events-none" />;
};

export default WeatherBackground;

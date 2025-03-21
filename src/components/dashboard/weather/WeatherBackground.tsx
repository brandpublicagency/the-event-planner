
import React from 'react';
import { 
  RainAnimation,
  SnowAnimation,
  ThunderAnimation,
  FogAnimation,
  WindAnimation 
} from './animations';

interface WeatherBackgroundProps {
  weatherType?: string;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherType }) => {
  const type = weatherType?.toLowerCase() || '';
  
  if (type.includes('rain') || type.includes('shower') || type.includes('drizzle')) {
    return <RainAnimation />;
  }
  
  if (type.includes('snow')) {
    return <SnowAnimation />;
  }
  
  if (type.includes('thunder') || type.includes('lightning')) {
    return <ThunderAnimation />;
  }
  
  if (type.includes('fog') || type.includes('mist') || type.includes('haze')) {
    return <FogAnimation />;
  }
  
  if (type.includes('wind')) {
    return <WindAnimation />;
  }
  
  return null;
};

export default WeatherBackground;

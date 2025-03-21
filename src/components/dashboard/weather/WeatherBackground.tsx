
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
  
  return (
    <div className="absolute inset-0 z-0">
      {type.includes('rain') || type.includes('shower') || type.includes('drizzle') ? (
        <RainAnimation />
      ) : type.includes('snow') ? (
        <SnowAnimation />
      ) : type.includes('thunder') || type.includes('lightning') ? (
        <ThunderAnimation />
      ) : type.includes('fog') || type.includes('mist') || type.includes('haze') ? (
        <FogAnimation />
      ) : type.includes('wind') ? (
        <WindAnimation />
      ) : null}
    </div>
  );
};

export default WeatherBackground;


import React from 'react';
import { 
  RainAnimation,
  ThunderAnimation,
  FogAnimation,
  WindAnimation 
} from './animations';

interface WeatherBackgroundProps {
  weatherType?: string;
  todayOnly?: boolean; // New prop to control if animation is only shown in today section
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ 
  weatherType,
  todayOnly = false
}) => {
  const type = weatherType?.toLowerCase() || '';
  
  // Debug logging to check what animation should display
  console.log("Weather background type:", type);
  console.log("Today only:", todayOnly);
  
  // If todayOnly is true and we're not in the today section, don't show any animation
  if (todayOnly && !weatherType) {
    return null;
  }
  
  // If todayOnly is true, use a more focused container
  const containerClass = todayOnly 
    ? "absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden" 
    : "absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden";
  
  return (
    <div className={containerClass}>
      {type.includes('rain') || type.includes('shower') || type.includes('drizzle') ? (
        <RainAnimation />
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

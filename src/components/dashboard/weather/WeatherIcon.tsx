
import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind, CloudSun, Moon } from 'lucide-react';

interface WeatherIconProps {
  condition?: string;
  customIcon?: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition = 'clear', 
  customIcon,
  className = 'h-6 w-6' 
}) => {
  const normalizedCondition = (condition || '').toLowerCase();
  const iconSize = className;
  
  // If sunset is specified, render sunset icon
  if (normalizedCondition === 'sunset') {
    return (
      <div className={className}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3V5M5.6 5.6L7 7M3 12H5M5.6 18.4L7 17M21 12H19M18.4 18.4L17 17M18.4 5.6L17 7M12 19V21M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }
  
  // If customIcon is provided, use OpenWeather icon codes
  if (customIcon) {
    const isNight = customIcon.endsWith('n');
    
    if (customIcon.startsWith('01')) {
      return isNight ? <Moon className={iconSize} /> : <Sun className={iconSize} />;
    } else if (customIcon.startsWith('02')) {
      return isNight ? <CloudSun className={iconSize} /> : <CloudSun className={iconSize} />;
    } else if (customIcon.startsWith('03') || customIcon.startsWith('04')) {
      return <Cloud className={iconSize} />;
    } else if (customIcon.startsWith('09')) {
      return <CloudDrizzle className={iconSize} />;
    } else if (customIcon.startsWith('10')) {
      return <CloudRain className={iconSize} />;
    } else if (customIcon.startsWith('11')) {
      return <CloudLightning className={iconSize} />;
    } else if (customIcon.startsWith('13')) {
      return <CloudSnow className={iconSize} />;
    } else if (customIcon.startsWith('50')) {
      return <CloudFog className={iconSize} />;
    }
  }
  
  // Fallback to condition-based icons
  if (normalizedCondition.includes('clear') || normalizedCondition.includes('sunny')) {
    return <Sun className={iconSize} />;
  } else if (normalizedCondition.includes('partly cloudy')) {
    return <CloudSun className={iconSize} />;
  } else if (normalizedCondition.includes('cloud')) {
    return <Cloud className={iconSize} />;
  } else if (normalizedCondition.includes('drizzle')) {
    return <CloudDrizzle className={iconSize} />;
  } else if (normalizedCondition.includes('rain')) {
    return <CloudRain className={iconSize} />;
  } else if (normalizedCondition.includes('thunder')) {
    return <CloudLightning className={iconSize} />;
  } else if (normalizedCondition.includes('snow')) {
    return <CloudSnow className={iconSize} />;
  } else if (normalizedCondition.includes('fog') || normalizedCondition.includes('mist')) {
    return <CloudFog className={iconSize} />;
  } else if (normalizedCondition.includes('wind')) {
    return <Wind className={iconSize} />;
  }
  
  // Default
  return <Cloud className={iconSize} />;
};

export default WeatherIcon;

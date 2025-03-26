
import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Moon, CloudMoon } from 'lucide-react';

export interface WeatherIconProps {
  condition: string;
  customIcon?: string;
  className?: string;
  isNight?: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  customIcon, 
  className = "w-10 h-10",
  isNight = false
}) => {
  const getIconFromCode = (iconCode: string) => {
    const codeIsNight = iconCode?.endsWith('n');
    const actualIsNight = isNight || codeIsNight;
    
    // Get main weather type from OpenWeather icon code
    // First character(s) indicate weather condition
    const weatherType = iconCode?.substring(0, 2);
    
    switch (weatherType) {
      case '01': return actualIsNight ? <Moon className={className} /> : <Sun className={className} />;
      case '02':
      case '03':
      case '04': return actualIsNight ? <CloudMoon className={className} /> : <Cloud className={className} />;
      case '09':
      case '10': return <CloudRain className={className} />;
      case '11': return <CloudLightning className={className} />;
      case '13': return <CloudSnow className={className} />;
      case '50': return <CloudFog className={className} />;
      default: return actualIsNight ? <Moon className={className} /> : <Sun className={className} />;
    }
  };
  
  // If a custom icon code is provided (from OpenWeather), use that
  if (customIcon) {
    return getIconFromCode(customIcon);
  }
  
  // Otherwise determine by condition string
  switch (condition?.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return isNight ? <Moon className={className} /> : <Sun className={className} />;
    case 'clouds':
    case 'cloudy':
    case 'partly cloudy':
    case 'overcast':
      return isNight ? <CloudMoon className={className} /> : <Cloud className={className} />;
    case 'rain':
    case 'rainy':
    case 'drizzle':
    case 'showers':
      return <CloudRain className={className} />;
    case 'storm':
    case 'thunderstorm':
    case 'thunder':
      return <CloudLightning className={className} />;
    case 'snow':
    case 'snowy':
    case 'sleet':
    case 'hail':
      return <CloudSnow className={className} />;
    case 'mist':
    case 'fog':
    case 'haze':
      return <CloudFog className={className} />;
    default:
      return isNight ? <Moon className={className} /> : <Sun className={className} />; // Default
  }
};

export default WeatherIcon;

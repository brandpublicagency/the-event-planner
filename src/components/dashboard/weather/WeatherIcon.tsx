
import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon } from 'lucide-react';

interface WeatherIconProps {
  condition?: string;
  className?: string;
  isNight?: boolean;
  customIcon?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition = 'Clear', 
  className = '', 
  isNight = false,
  customIcon
}) => {
  // If we have a custom icon from the API (like 01d, 02n, etc.), use it to determine the condition
  if (customIcon) {
    const iconCode = customIcon.substring(0, 2);
    
    switch (iconCode) {
      case '01': // clear sky
        condition = 'Clear';
        break;
      case '02': // few clouds
      case '03': // scattered clouds
        condition = 'Partly Cloudy';
        break;
      case '04': // broken clouds
        condition = 'Cloudy';
        break;
      case '09': // shower rain
      case '10': // rain
        condition = 'Rain';
        break;
      case '11': // thunderstorm
        condition = 'Thunderstorm';
        break;
      case '13': // snow
        condition = 'Snow';
        break;
      case '50': // mist, fog
        condition = 'Fog';
        break;
    }
    
    // Check if it's night based on the icon suffix
    if (customIcon.endsWith('n')) {
      isNight = true;
    }
  }
  
  // Normalize the condition for consistent matching
  const normalizedCondition = condition?.toLowerCase() || 'clear';
  
  // Choose the appropriate icon based on the weather condition
  const getWeatherIcon = () => {
    if (normalizedCondition.includes('clear') || normalizedCondition.includes('sunny')) {
      return isNight ? <Moon className={className} /> : <Sun className={className} />;
    } else if (normalizedCondition.includes('partly cloudy') || normalizedCondition.includes('few clouds') || normalizedCondition.includes('scattered')) {
      return <div className="relative">
        {isNight ? <Moon className={className} /> : <Sun className={className} />}
        <Cloud className={`absolute -right-1 -bottom-1 h-3 w-3 text-white/80`} />
      </div>;
    } else if (normalizedCondition.includes('cloud')) {
      return <Cloud className={className} />;
    } else if (normalizedCondition.includes('drizzle')) {
      return <CloudDrizzle className={className} />;
    } else if (normalizedCondition.includes('rain') || normalizedCondition.includes('shower')) {
      return <CloudRain className={className} />;
    } else if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm') || normalizedCondition.includes('lightning')) {
      return <CloudLightning className={className} />;
    } else if (normalizedCondition.includes('snow') || normalizedCondition.includes('sleet')) {
      return <CloudSnow className={className} />;
    } else if (normalizedCondition.includes('fog') || normalizedCondition.includes('mist') || normalizedCondition.includes('haze')) {
      return <CloudFog className={className} />;
    } else {
      // Default to clear weather
      return isNight ? <Moon className={className} /> : <Sun className={className} />;
    }
  };

  return getWeatherIcon();
};

export default WeatherIcon;

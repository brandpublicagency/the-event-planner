
import React from 'react';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudFog, Moon, Sunrise, Sunset } from 'lucide-react';

interface WeatherIconProps {
  weatherData?: any;
  currentHour: number;
  chanceOfRain: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ weatherData, currentHour, chanceOfRain }) => {
  // First check if we have weather data with description
  if (weatherData?.description) {
    const desc = weatherData.description.toLowerCase();
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
      return <CloudRain className="h-5 w-5" />;
    } else if (desc.includes('snow')) {
      return <CloudSnow className="h-5 w-5" />;
    } else if (desc.includes('lightning') || desc.includes('thunder')) {
      return <CloudLightning className="h-5 w-5" />;
    } else if (desc.includes('fog') || desc.includes('mist')) {
      return <CloudFog className="h-5 w-5" />;
    } else if (desc.includes('cloud')) {
      return <Cloud className="h-5 w-5" />;
    }
  }
  
  // Fallback to time-based icons
  // Nighttime (7 PM - 5 AM)
  if (currentHour >= 19 || currentHour < 5) {
    return <Moon className="h-5 w-5" />;
  }
  // Early morning or late afternoon
  else if ((currentHour >= 5 && currentHour < 8) || (currentHour >= 16 && currentHour < 19)) {
    return chanceOfRain === "HIGH" ? <Cloud className="h-5 w-5" /> : 
           (currentHour < 12 ? <Sunrise className="h-5 w-5" /> : <Sunset className="h-5 w-5" />);
  }
  // Daytime
  else {
    return chanceOfRain === "HIGH" ? <Cloud className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  }
};

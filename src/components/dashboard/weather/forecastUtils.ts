
import { addDays } from "date-fns";

export interface ForecastDay {
  date: Date;
  high: number;
  low: number;
  rainChance: number;
  condition: string;
  humidity: number;
  wind: number;
  uv: number;
}

export interface WeatherData {
  temp?: number;
  condition?: string;
  description?: string;
  humidity?: number;
  wind?: number;
  uv?: number;
  location?: string;
}

export const generateForecastFromWeatherData = (weatherData?: WeatherData): ForecastDay[] => {
  if (!weatherData) return [];
  
  const baseTemp = weatherData.temp || 25;
  const baseCondition = weatherData.condition || 'Clouds';
  const baseDescription = weatherData.description || 'partly cloudy';
  
  return Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(new Date(), index + 1);
    
    const tempVariation = Math.floor(Math.random() * 8) - 4;
    const high = Math.max(10, Math.min(40, baseTemp + tempVariation));
    const low = high - (5 + Math.floor(Math.random() * 10));
    
    let rainChance;
    if (index === 0) {
      rainChance = baseDescription.includes('rain') 
        ? 60 + Math.floor(Math.random() * 30)
        : baseDescription.includes('cloud') 
          ? 30 + Math.floor(Math.random() * 30)
          : Math.floor(Math.random() * 30);
    } else {
      const prevDayInfluence = Math.max(0, 7 - index) / 7;
      const baseRainChance = baseDescription.includes('rain') ? 70 : 30;
      rainChance = Math.floor(baseRainChance * prevDayInfluence + Math.random() * (100 - baseRainChance * prevDayInfluence));
    }
    
    let condition = baseCondition.toLowerCase();
    if (rainChance > 70) condition = 'rain';
    else if (rainChance > 50) condition = 'cloudy';
    else if (rainChance > 30) condition = 'partly-cloudy';
    else condition = 'sunny';
    
    const humidity = condition === 'rain' 
      ? 70 + Math.floor(Math.random() * 25)
      : condition === 'sunny' 
        ? 20 + Math.floor(Math.random() * 40)
        : 40 + Math.floor(Math.random() * 40);
    
    const uv = condition === 'sunny' 
      ? 6 + Math.floor(Math.random() * 5)
      : condition === 'partly-cloudy' 
        ? 3 + Math.floor(Math.random() * 4)
        : 1 + Math.floor(Math.random() * 3);
    
    const wind = 5 + Math.floor(Math.random() * 30);
    
    return {
      date,
      high,
      low,
      rainChance,
      condition,
      humidity,
      wind,
      uv
    };
  });
};

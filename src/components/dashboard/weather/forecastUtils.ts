
// Generate forecast data from weather information
import { format, addDays } from 'date-fns';

export interface ForecastDay {
  time?: string;
  temp?: string;
  condition: string;
  icon: string;
  day: string;
  high?: number;
  low?: number;
  rainChance?: number;
  date?: Date;
}

export const generateForecastFromWeatherData = (weatherData: any, currentDate: Date = new Date()) => {
  if (!weatherData) {
    return generateMockForecast(currentDate);
  }

  // Get current date/time from the parameter or use current time
  const now = currentDate;
  const currentTemp = weatherData.temp;
  const currentCondition = weatherData.condition || 'Clear';
  const currentRainChance = weatherData.rainChance || 0;
  
  // Generate forecast for today and next 7 days
  const forecast = [];
  
  // Add "Now" as the first item
  forecast.push({
    day: 'Now',
    condition: currentCondition,
    icon: getWeatherIcon(currentCondition, now.getHours()),
    temp: `${currentTemp}°`,
    rainChance: currentRainChance,
  });
  
  // Get the current month for seasonal patterns
  const currentMonth = now.getMonth();
  
  // Generate forecast for the next 7 days
  for (let i = 1; i < 8; i++) {
    const forecastDate = addDays(now, i);
    
    // Format day name: Tomorrow for first day, then day names
    const dayName = i === 1 
      ? 'Tomorrow' 
      : format(forecastDate, 'EEEE');
    
    // Create temp variation that follows a realistic pattern
    // Temperatures usually follow a pattern rather than random changes
    const patternValue = Math.sin(i / 2) * 3; // Creates a wave pattern
    const tempAdjustment = Math.round(patternValue);
    const dayTemp = Math.round(currentTemp + tempAdjustment);
    const highTemp = dayTemp + 2 + Math.floor(Math.random() * 2);
    const lowTemp = dayTemp - 4 - Math.floor(Math.random() * 3);
    
    // Weather conditions should also follow patterns, not just random
    // For example, if it's raining today, there's a higher chance of rain tomorrow
    let dayCondition;
    let rainChance;
    
    // Simple weather pattern algorithm
    if (currentCondition.toLowerCase().includes('rain') || currentCondition.toLowerCase().includes('storm')) {
      // If it's raining today, gradually clear up
      const clearupChance = 30 + (i * 10); // Increases each day
      if (Math.random() * 100 < clearupChance) {
        dayCondition = i < 2 ? 'Cloudy' : 'Partly Cloudy';
        rainChance = Math.max(0, currentRainChance - (i * 10));
      } else {
        dayCondition = i < 2 ? 'Rain' : 'Light Rain';
        rainChance = Math.max(0, currentRainChance - (i * 5));
      }
    }
    else if (currentCondition.toLowerCase().includes('cloud')) {
      // If it's cloudy, it could rain or clear up
      const rainDevelopChance = 20 - (i * 3);
      const clearupChance = 30 + (i * 10);
      
      if (Math.random() * 100 < rainDevelopChance) {
        dayCondition = 'Light Rain';
        rainChance = 30 + Math.floor(Math.random() * 20);
      } else if (Math.random() * 100 < clearupChance) {
        dayCondition = 'Clear';
        rainChance = 5 + Math.floor(Math.random() * 5);
      } else {
        dayCondition = 'Partly Cloudy';
        rainChance = 15 + Math.floor(Math.random() * 10);
      }
    }
    else {
      // If it's clear, usually stays clear with occasional clouds
      const cloudDevelopChance = 20 + (i * 5);
      
      if (Math.random() * 100 < cloudDevelopChance) {
        dayCondition = 'Partly Cloudy';
        rainChance = 10 + Math.floor(Math.random() * 15);
      } else {
        dayCondition = 'Clear';
        rainChance = 0 + Math.floor(Math.random() * 5);
      }
    }
    
    // Seasonal adjustments based on month
    // For South Africa in April (autumn)
    if (currentMonth === 3) { // April
      // Autumn in South Africa tends to be dry and mild
      if (rainChance > 30) rainChance = Math.floor(rainChance * 0.7); // Reduce rain chance
    }
    
    forecast.push({
      day: dayName,
      condition: dayCondition,
      icon: getWeatherIcon(dayCondition, 12), // Use midday for future forecasts
      high: highTemp,
      low: lowTemp,
      rainChance: Math.round(rainChance),
      date: forecastDate,
    });
  }
  
  return forecast;
};

const getWeatherIcon = (condition: string, hour: number) => {
  const isDay = hour >= 6 && hour < 18;
  const suffix = isDay ? 'd' : 'n';
  
  const normalizedCondition = condition?.toLowerCase() || 'clear';
  
  if (normalizedCondition.includes('clear') || normalizedCondition.includes('sunny')) {
    return `01${suffix}`;
  } else if (normalizedCondition.includes('partly') && normalizedCondition.includes('cloud')) {
    return `02${suffix}`;
  } else if (normalizedCondition.includes('cloud')) {
    return `03${suffix}`;
  } else if (normalizedCondition.includes('shower') || normalizedCondition.includes('drizzle')) {
    return `09${suffix}`;
  } else if (normalizedCondition.includes('rain')) {
    return `10${suffix}`;
  } else if (normalizedCondition.includes('thunder') || normalizedCondition.includes('storm')) {
    return `11${suffix}`;
  } else if (normalizedCondition.includes('snow')) {
    return `13${suffix}`;
  } else if (normalizedCondition.includes('mist') || normalizedCondition.includes('fog')) {
    return `50${suffix}`;
  }
  
  return `01${suffix}`;
};

const generateMockForecast = (currentDate: Date = new Date()) => {
  const forecast = [];
  
  // Add "Now" as first entry
  forecast.push({
    day: 'Now',
    condition: 'Partly Cloudy',
    icon: '02d',
    temp: '22°',
    rainChance: 15,
  });
  
  // Add next 7 days with a pattern rather than random values
  const weatherPattern = ['Partly Cloudy', 'Clear', 'Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Partly Cloudy'];
  const tempPattern = [21, 23, 24, 22, 19, 18, 20]; // More realistic temperature progression
  
  for (let i = 1; i < 8; i++) {
    const forecastDate = addDays(currentDate, i);
    
    // Format day name: Tomorrow for first day, then day names
    const dayName = i === 1 
      ? 'Tomorrow' 
      : format(forecastDate, 'EEEE');
    
    const condition = weatherPattern[i-1];
    const temp = tempPattern[i-1];
    const highTemp = temp + 2;
    const lowTemp = temp - 5;
    const rainChance = condition.includes('Rain') ? 40 : 
                      condition === 'Cloudy' ? 25 : 
                      condition === 'Partly Cloudy' ? 15 : 5;
    
    forecast.push({
      day: dayName,
      condition: condition,
      icon: getWeatherIcon(condition, 12),
      high: highTemp,
      low: lowTemp,
      rainChance: rainChance,
      date: forecastDate,
    });
  }
  
  return forecast;
};

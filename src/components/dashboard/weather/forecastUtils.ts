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
    console.log("No weather data provided to generate forecast");
    return generateMockForecast(currentDate);
  }

  // Get current date/time from the parameter or use current time
  const now = currentDate;
  const currentTemp = weatherData.temp;
  const currentCondition = weatherData.condition || 'Clear';
  
  // Generate forecast for today and next 4 days
  const forecast = [];
  
  // Add "Now" as the first item
  forecast.push({
    day: 'Now',
    condition: currentCondition,
    icon: getWeatherIcon(currentCondition, now.getHours()),
    temp: `${currentTemp}°`,
  });
  
  // Generate forecast for the next 4 days
  for (let i = 1; i < 5; i++) {
    const forecastDate = addDays(now, i);
    
    // Format day name: Tomorrow for first day, then day names
    const dayName = i === 1 
      ? 'Tomorrow' 
      : format(forecastDate, 'EEEE');
    
    // Create temp variation for future days
    const tempAdjustment = Math.round(Math.random() * 4) - 2; // Random adjustment between -2 and 2
    const dayTemp = Math.round(currentTemp + tempAdjustment);
    const highTemp = dayTemp + 2 + Math.floor(Math.random() * 2);
    const lowTemp = dayTemp - 4 - Math.floor(Math.random() * 3);
    
    // Randomly vary condition for future days
    const weatherConditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm'];
    const randomConditionIndex = Math.floor(Math.random() * weatherConditions.length);
    const dayCondition = weatherConditions[randomConditionIndex];
    
    forecast.push({
      day: dayName,
      condition: dayCondition,
      icon: getWeatherIcon(dayCondition, 12), // Use midday for future forecasts
      high: highTemp,
      low: lowTemp,
      date: forecastDate,
    });
  }
  
  return forecast;
};

const getWeatherIcon = (condition: string, hour: number) => {
  const isDay = hour >= 6 && hour < 18;
  const suffix = isDay ? 'd' : 'n';
  
  condition = condition.toLowerCase();
  
  if (condition.includes('clear') || condition.includes('sunny')) {
    return `01${suffix}`;
  } else if (condition.includes('partly') && condition.includes('cloud')) {
    return `02${suffix}`;
  } else if (condition.includes('cloud')) {
    return `03${suffix}`;
  } else if (condition.includes('shower') || condition.includes('drizzle')) {
    return `09${suffix}`;
  } else if (condition.includes('rain')) {
    return `10${suffix}`;
  } else if (condition.includes('thunder')) {
    return `11${suffix}`;
  } else if (condition.includes('snow')) {
    return `13${suffix}`;
  } else if (condition.includes('mist') || condition.includes('fog')) {
    return `50${suffix}`;
  }
  
  return `01${suffix}`;
};

const generateMockForecast = (currentDate: Date = new Date()) => {
  const forecast = [];
  
  // Add "Now" as first entry
  forecast.push({
    day: 'Now',
    condition: 'Cloudy',
    icon: '03d',
    temp: '22°',
  });
  
  // Add next 4 days
  for (let i = 1; i < 5; i++) {
    const forecastDate = addDays(currentDate, i);
    
    // Format day name: Tomorrow for first day, then day names
    const dayName = i === 1 
      ? 'Tomorrow' 
      : format(forecastDate, 'EEEE');
    
    const temp = 22 - i;
    const highTemp = temp + 2;
    const lowTemp = temp - 4;
    
    forecast.push({
      day: dayName,
      condition: 'Cloudy',
      icon: '03d',
      temp: `${temp}°`,
      high: highTemp,
      low: lowTemp,
      date: forecastDate,
    });
  }
  
  return forecast;
};

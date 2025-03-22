
// Generate forecast data from weather information

export interface ForecastDay {
  time?: string;
  temp?: string;
  condition: string;
  icon: string;
  day: string;
  high: number;
  low: number;
  rainChance: number;
  date?: Date;
}

export const generateForecastFromWeatherData = (weatherData: any) => {
  if (!weatherData) {
    console.log("No weather data provided to generate forecast");
    return generateMockForecast();
  }

  // Get current date/time
  const now = new Date();
  const currentTemp = weatherData.temp;
  const currentCondition = weatherData.condition || 'Clear';

  // Generate a forecast for today and the next 7 days
  const forecast = [];
  
  for (let i = 0; i < 8; i++) {
    const forecastDate = new Date(now);
    forecastDate.setDate(now.getDate() + i);
    
    // Generate plausible temperature variations
    // Higher highs and lower lows for future days (more uncertainty)
    const variationFactor = Math.min(i * 0.5, 3); // Increases uncertainty for future days, max 3 degrees
    
    // Add some randomness to temperature and create realistic daily variations
    const randomFactor = Math.random() * 2 - 1; // Between -1 and 1
    const dayTemp = currentTemp + randomFactor * 2 + variationFactor; // Slightly warmer or cooler base
    
    // High and low temps with a bigger difference for future days
    const tempDelta = 3 + variationFactor; // The further in the future, the more extreme the difference
    const high = Math.round(dayTemp + tempDelta); 
    const low = Math.round(dayTemp - tempDelta);
    
    // Rain chance increases slightly for future days (more uncertainty)
    const baseRainChance = i === 0 ? 
      (currentCondition.toLowerCase().includes('rain') ? 60 : 10) : // Today's rain based on current condition
      20 + Math.floor(Math.random() * 10) * i / 2; // Future rain chance increases with days
    
    const rainChance = Math.min(Math.floor(baseRainChance), 90); // Cap at 90%
    
    // Vary conditions for future days
    let condition = currentCondition;
    if (i > 1) {
      const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny'];
      const randomIndex = Math.floor(Math.random() * conditions.length);
      condition = conditions[randomIndex];
      
      // Make rain more likely if rain chance is high
      if (rainChance > 50 && !condition.toLowerCase().includes('rain')) {
        condition = Math.random() > 0.5 ? 'Light Rain' : 'Showers';
      }
    }
    
    // Format the day name
    const dayName = i === 0 ? 'Today' : 
                   i === 1 ? 'Tomorrow' : 
                   formatDay(forecastDate);
    
    forecast.push({
      day: dayName,
      date: forecastDate,
      condition: condition,
      icon: getWeatherIcon(condition, forecastDate.getHours()),
      high: high,
      low: low,
      rainChance: rainChance
    });
  }
  
  return forecast;
};

const formatDay = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
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

const generateMockForecast = () => {
  const now = new Date();
  const forecast = [];
  
  for (let i = 0; i < 8; i++) {
    const forecastDate = new Date(now);
    forecastDate.setDate(now.getDate() + i);
    
    // Generate random but plausible temperatures
    const baseTemp = 22; // Base temperature
    const dayVariation = Math.random() * 6 - 3; // -3 to +3 variation
    const dayTemp = baseTemp + dayVariation;
    
    // More extreme for future days
    const tempRange = 3 + Math.min(i, 4);
    const high = Math.round(dayTemp + tempRange);
    const low = Math.round(dayTemp - tempRange);
    
    // Random conditions, but with more variation for future days
    const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny'];
    const randomIndex = Math.floor(Math.random() * conditions.length);
    const condition = conditions[randomIndex];
    
    // Random rain chance
    const rainChance = Math.floor(Math.random() * 30) + (condition.includes('Rain') ? 40 : 0);
    
    // Format the day name
    const dayName = i === 0 ? 'Today' : 
                   i === 1 ? 'Tomorrow' : 
                   formatDay(forecastDate);
    
    forecast.push({
      day: dayName,
      date: forecastDate,
      condition: condition,
      icon: getWeatherIcon(condition, forecastDate.getHours()),
      high: high,
      low: low,
      rainChance: rainChance
    });
  }
  
  return forecast;
};

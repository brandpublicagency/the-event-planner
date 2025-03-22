
// Generate forecast data from weather information

export interface ForecastDay {
  time: string;
  temp: string;
  condition: string;
  icon: string;
  day?: string;
  high?: number;
  low?: number;
  rainChance?: number;
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

  // Generate a forecast for the next few hours
  const forecast = [];
  
  // Start with current hour
  for (let i = 0; i < 5; i++) {
    const forecastHour = new Date(now);
    forecastHour.setHours(now.getHours() + i);
    
    // Generate a plausible temperature based on time of day
    let tempVariation = 0;
    const hour = forecastHour.getHours();
    
    if (hour >= 6 && hour < 12) {
      // Morning - slowly warming up
      tempVariation = i * 0.7;
    } else if (hour >= 12 && hour < 15) {
      // Midday - warmest
      tempVariation = 0;
    } else if (hour >= 15 && hour < 20) {
      // Afternoon/evening - cooling down
      tempVariation = -i * 0.5;
    } else {
      // Night - coolest
      tempVariation = -i * 0.3;
    }
    
    // Add some randomness
    tempVariation += (Math.random() - 0.5) * 2;
    
    // Create forecast entry
    const forecastTemp = Math.round(currentTemp + tempVariation);
    
    // Calculate mock high and low temperatures for the forecast
    const high = forecastTemp + Math.floor(Math.random() * 2) + 1;
    const low = forecastTemp - Math.floor(Math.random() * 3) - 1;
    const rainChance = Math.floor(Math.random() * 30); // Random rain chance between 0-30%
    
    forecast.push({
      time: formatHour(forecastHour),
      temp: `${forecastTemp}°`,
      condition: currentCondition,
      icon: weatherData.icon || getWeatherIcon(currentCondition, hour),
      day: i === 0 ? 'Today' : formatDay(forecastHour),
      high: high,
      low: low,
      rainChance: rainChance
    });
  }
  
  return forecast;
};

const formatHour = (date: Date) => {
  return date.getHours().toString().padStart(2, '0') + ':00';
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
  } else if (condition.includes('cloud')) {
    return `02${suffix}`;
  } else if (condition.includes('rain') || condition.includes('shower')) {
    return `09${suffix}`;
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
  
  for (let i = 0; i < 5; i++) {
    const forecastHour = new Date(now);
    forecastHour.setHours(now.getHours() + i);
    
    const hour = forecastHour.getHours();
    let temp = 22; // Default base temperature
    
    if (hour >= 6 && hour < 12) {
      // Morning - warming up
      temp = 18 + i;
    } else if (hour >= 12 && hour < 17) {
      // Midday - warmest
      temp = 24 - Math.abs(i - 2);
    } else if (hour >= 17 && hour < 22) {
      // Evening - cooling down
      temp = 20 - i;
    } else {
      // Night - coolest
      temp = 16 - Math.floor(i/2);
    }
    
    // Add some randomness
    temp += Math.floor(Math.random() * 3) - 1;
    
    const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Calculate mock high and low temperatures
    const high = temp + Math.floor(Math.random() * 2) + 1;
    const low = temp - Math.floor(Math.random() * 3) - 1;
    const rainChance = Math.floor(Math.random() * 30); // Random rain chance between 0-30%
    
    forecast.push({
      time: formatHour(forecastHour),
      temp: `${temp}°`,
      condition: condition,
      icon: getWeatherIcon(condition, hour),
      day: i === 0 ? 'Today' : formatDay(forecastHour),
      high: high,
      low: low,
      rainChance: rainChance
    });
  }
  
  return forecast;
};

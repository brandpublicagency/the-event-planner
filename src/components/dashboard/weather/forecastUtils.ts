
// Generate forecast data from weather information

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
  const currentHour = now.getHours();
  const currentTemp = weatherData.temp;
  const currentCondition = weatherData.condition || 'Clear';
  
  // Generate hourly forecast for the rest of today
  const forecast = [];
  
  // Generate hourly forecast starting from current hour
  // Showing 5 time periods
  for (let i = 0; i < 5; i++) {
    const forecastHour = (currentHour + i) % 24;
    
    // Format the hour display
    let hourDisplay;
    if (i === 0) {
      hourDisplay = 'Now';
    } else if (forecastHour === 0) {
      hourDisplay = '00';
    } else {
      hourDisplay = forecastHour.toString();
    }
    
    // Special case for sunset
    const isSunset = forecastHour >= 17 && forecastHour <= 18;
    
    // Determine the condition based on hour and weather
    let condition = currentCondition;
    if (isSunset) {
      hourDisplay = 'Sunset';
      condition = 'Sunset';
    }

    // Create temp variation based on time of day
    let tempAdjustment = 0;
    if (forecastHour >= 12 && forecastHour <= 15) {
      // Warmest part of day
      tempAdjustment = 1;
    } else if (forecastHour >= 19 || forecastHour <= 5) {
      // Coolest part of day
      tempAdjustment = -2 - i * 0.5;
    }
    
    const hourTemp = Math.round(currentTemp + tempAdjustment);
    
    forecast.push({
      day: hourDisplay,
      condition: condition,
      icon: isSunset ? 'sunset' : getWeatherIcon(condition, forecastHour),
      temp: `${hourTemp}°`,
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
  const currentHour = currentDate.getHours();
  const forecast = [];
  
  // Generate hourly forecast
  for (let i = 0; i < 5; i++) {
    const forecastHour = (currentHour + i) % 24;
    
    // Format the hour display
    let hourDisplay;
    if (i === 0) {
      hourDisplay = 'Now';
    } else if (forecastHour === 0) {
      hourDisplay = '00';
    } else {
      hourDisplay = forecastHour.toString();
    }
    
    // Special case for sunset
    const isSunset = i === 2;
    
    // Determine temperature based on time of day
    let temp;
    if (forecastHour >= 12 && forecastHour <= 15) {
      // Warmest part of day
      temp = 23 - i;
    } else if (forecastHour >= 19 || forecastHour <= 5) {
      // Coolest part of day
      temp = 21 - i;
    } else {
      temp = 22 - i;
    }
    
    forecast.push({
      day: isSunset ? 'Sunset' : hourDisplay,
      condition: isSunset ? 'Sunset' : 'Cloudy',
      icon: isSunset ? 'sunset' : '03d',
      temp: `${temp}°`,
    });
  }
  
  return forecast;
};

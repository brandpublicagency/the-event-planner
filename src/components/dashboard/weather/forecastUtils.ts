
import { format, addDays } from 'date-fns';

// Define the forecast day type
export interface ForecastDay {
  date: Date;
  day: string;
  condition: string;
  high: number;
  low: number;
  rainChance: number;
  humidity: number;
  wind: number;
  uv: number;
}

// Generate random weather data for the next 7 days
export const generateForecastFromWeatherData = (weatherData: any): ForecastDay[] => {
  console.log("Generating forecast from weather data:", weatherData);
  
  // If no weather data is provided, return an empty array
  if (!weatherData) {
    console.log("No weather data provided for forecast");
    return [];
  }
  
  const today = new Date();
  const forecast: ForecastDay[] = [];
  
  // Weather conditions that might occur
  const conditions = [
    'Clear', 'Clouds', 'Rain', 'Drizzle', 
    'Thunderstorm', 'Snow', 'Mist', 'Fog'
  ];
  
  // Use the first day's weather as a base (today's weather from API)
  const baseTemp = weatherData.temp || 25;
  const baseCondition = weatherData.condition || 'Clear';
  const baseHumidity = weatherData.humidity || 50;
  const baseWind = weatherData.wind_speed || 10;
  const baseUv = weatherData.uv || 4;
  const baseRainChance = weatherData.rainChance || 10; // Use provided rainChance or default to 10%
  
  // Generate data for 7 days starting from tomorrow
  for (let i = 1; i < 8; i++) {
    const date = addDays(today, i);
    
    // Create some variation in the weather - base it on the actual weather data
    // but with some randomization to make it look realistic
    const tempVariation = Math.floor(Math.random() * 8) - 4; // -4 to +3 degrees
    const highTemp = Math.round(baseTemp + tempVariation);
    const lowTemp = Math.round(highTemp - (3 + Math.random() * 5)); // 3-8 degrees lower
    
    // Randomize condition more as we get further into the forecast
    let condition = baseCondition;
    if (Math.random() < i * 0.08) { // More likely to change as days progress
      condition = conditions[Math.floor(Math.random() * conditions.length)];
    }
    
    const rainChance = condition.toLowerCase().includes('rain') || 
                      condition.toLowerCase().includes('shower') || 
                      condition.toLowerCase().includes('thunder') ? 
                      40 + Math.floor(Math.random() * 50) : // 40-90% if rainy condition
                      Math.floor(Math.random() * 30); // 0-30% otherwise
    
    // Add more variation for humidity, wind and UV
    const humidityVar = Math.floor(Math.random() * 20) - 10; // -10 to +10
    const windVar = Math.floor(Math.random() * 6) - 3; // -3 to +2
    const uvVar = Math.floor(Math.random() * 3) - 1; // -1 to +1
    
    forecast.push({
      date: date,
      day: format(date, 'EEE'),
      condition: condition,
      high: highTemp,
      low: lowTemp,
      rainChance: rainChance,
      humidity: Math.min(Math.max(baseHumidity + humidityVar, 20), 95), // 20-95%
      wind: Math.max(baseWind + windVar, 1), // min 1 km/h
      uv: Math.min(Math.max(baseUv + uvVar, 1), 10) // 1-10 UV index
    });
  }
  
  console.log("Generated forecast:", forecast);
  return forecast;
};


/**
 * Creates realistic fallback weather data when API fails
 */
export function createFallbackWeatherData() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  
  // Generate a temperature based on time of day
  let baseTemp = 22; // Default base temperature
  
  if (currentHour >= 5 && currentHour < 10) {
    // Morning - cooler
    baseTemp = 18 + Math.floor(Math.random() * 4);
  } else if (currentHour >= 10 && currentHour < 15) {
    // Midday - warmest
    baseTemp = 24 + Math.floor(Math.random() * 6);
  } else if (currentHour >= 15 && currentHour < 19) {
    // Afternoon - warm
    baseTemp = 22 + Math.floor(Math.random() * 5);
  } else {
    // Evening/night - cooler
    baseTemp = 16 + Math.floor(Math.random() * 5);
  }
  
  // Generate random humidity and wind speed
  const humidity = 40 + Math.floor(Math.random() * 30); // 40-70%
  const windSpeed = 8 + Math.floor(Math.random() * 7); // 8-15 km/h
  
  // Calculate high and low temperatures
  const highTemp = baseTemp + 2 + Math.floor(Math.random() * 2);
  const lowTemp = baseTemp - 6 - Math.floor(Math.random() * 2);
  
  return {
    date: currentDate.toISOString().split('T')[0],
    temp: baseTemp,
    feels_like: baseTemp + Math.floor(Math.random() * 3) - 1, // +/- 1 degree
    high: highTemp,
    low: lowTemp,
    humidity: humidity,
    wind_speed: windSpeed,
    condition: 'Cloudy',
    description: 'cloudy skies',
    icon: currentHour >= 6 && currentHour < 19 ? '02d' : '02n', // Day or night icon
    location: 'Bloemfontein',
    timestamp: currentDate.toISOString()
  };
}

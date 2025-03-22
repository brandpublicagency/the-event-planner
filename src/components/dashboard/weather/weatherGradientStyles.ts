
// This file provides gradient styles for different weather conditions

// Define possible time periods
type TimePeriod = 'morning' | 'day' | 'night';

// Weather gradient definitions
const weatherGradients = {
  // Sunrise gradient (early morning)
  sunrise: {
    background: "linear-gradient(to right, #FF6B6B, #556270)",
    fallbackClass: "bg-gradient-to-r from-red-400 to-slate-600"
  },
  
  // Sunset gradient (evening)
  sunset: {
    background: "linear-gradient(to left, #F29492, #114357)",
    fallbackClass: "bg-gradient-to-l from-red-300 to-slate-800"
  },
  
  // Cloudy Night gradient (night with clouds)
  cloudyNight: {
    background: "linear-gradient(to left, #274046, #E6DADA)",
    fallbackClass: "bg-gradient-to-l from-slate-800 to-gray-300"
  },
  
  // Cloudy Day gradient (day with clouds)
  cloudyDay: {
    background: "linear-gradient(to left, #E4E5E6, #00416A)",
    fallbackClass: "bg-gradient-to-l from-gray-200 to-blue-900"
  },
  
  // Night gradient (clear night)
  night: {
    background: "linear-gradient(to left, #29323c, #485563)",
    fallbackClass: "bg-gradient-to-l from-slate-800 to-slate-600"
  },
  
  // Sunny Day gradient (clear day)
  sunnyDay: {
    background: "linear-gradient(to right, rgb(3, 105, 161), rgb(56, 189, 248))",
    fallbackClass: "bg-gradient-to-r from-sky-700 to-sky-400"
  },
  
  // Rainy Day gradient (rain)
  rainyDay: {
    background: "linear-gradient(to bottom, #616161, #9BC5C3)",
    fallbackClass: "bg-gradient-to-b from-neutral-600 to-emerald-200/70"
  },
  
  // Thunderstorm gradient (storm)
  thunderstorm: {
    background: "linear-gradient(to right, #232526, #414345)",
    fallbackClass: "bg-gradient-to-r from-neutral-800 to-neutral-700"
  },
  
  // Foggy gradient (fog or mist)
  foggy: {
    background: "linear-gradient(to right, #757F9A, #D7DDE8)",
    fallbackClass: "bg-gradient-to-r from-slate-500 to-slate-300"
  },
  
  // Snow gradient
  snow: {
    background: "linear-gradient(to right, #E0EAFC, #CFDEF3)",
    fallbackClass: "bg-gradient-to-r from-blue-100 to-blue-200/80"
  }
};

/**
 * Get the appropriate gradient based on weather conditions and time
 * 
 * @param timeOfDay - Time period ('morning', 'day', 'night')
 * @param weatherCondition - Weather condition (e.g., 'clear', 'cloudy', 'rain')
 * @returns The appropriate gradient styles with fallback classes
 */
export const getWeatherGradientStyles = (
  timeOfDay: TimePeriod = 'day',
  weatherCondition: string = 'clear'
) => {
  // Normalize condition for consistency
  const condition = weatherCondition?.toLowerCase() || 'clear';
  
  // Convert timeOfDay to values needed for gradient selection
  const now = new Date();
  const hour = now.getHours();
  
  // Determine if it's sunrise or sunset time
  const isSunrise = timeOfDay === 'morning' && hour >= 5 && hour < 8;
  const isSunset = timeOfDay === 'night' && hour >= 17 && hour < 20;
  
  // Select gradient based on conditions and time
  let gradientKey = 'sunnyDay'; // Default fallback
  
  // Clear weather
  if (condition.includes('clear') || condition.includes('sunny')) {
    if (isSunrise) gradientKey = 'sunrise';
    else if (isSunset) gradientKey = 'sunset';
    else if (timeOfDay === 'day') gradientKey = 'sunnyDay';
    else gradientKey = 'night';
  }
  // Cloudy weather
  else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('partly')) {
    gradientKey = timeOfDay === 'night' ? 'cloudyNight' : 'cloudyDay';
  }
  // Rain
  else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    gradientKey = 'rainyDay';
  }
  // Thunderstorm
  else if (condition.includes('thunder') || condition.includes('storm') || condition.includes('lightning')) {
    gradientKey = 'thunderstorm';
  }
  // Fog and mist
  else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    gradientKey = 'foggy';
  }
  // Snow
  else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
    gradientKey = 'snow';
  }
  // Default: use time-based gradients
  else {
    if (isSunrise) gradientKey = 'sunrise';
    else if (isSunset) gradientKey = 'sunset';
    else if (timeOfDay === 'day') gradientKey = 'sunnyDay';
    else gradientKey = 'night';
  }
  
  return {
    gradientStyle: { background: weatherGradients[gradientKey].background },
    fallbackGradientClass: weatherGradients[gradientKey].fallbackClass
  };
};

// Helper functions no longer needed as they're incorporated in the main function

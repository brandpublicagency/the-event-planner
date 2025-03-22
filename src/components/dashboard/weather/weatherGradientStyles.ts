
// This file provides gradient styles for different weather conditions

// Define possible time periods
type TimePeriod = 'morning' | 'day' | 'night';

// Get gradient styles based on time of day and weather condition
export const getWeatherGradientStyles = (
  timeOfDay: TimePeriod = 'day',
  weatherCondition: string = 'clear'
) => {
  // Normalize condition for consistency
  const condition = weatherCondition?.toLowerCase() || 'clear';
  
  // Weather-specific gradients that override the defaults based on time of day
  const weatherGradients: Record<string, {background: string, fallbackClass: string}> = {
    // Rain conditions
    'rain': {
      background: 'linear-gradient(to bottom, #616161, #9BC5C3)',
      fallbackClass: 'bg-gradient-to-b from-neutral-600 to-emerald-200/70'
    },
    'drizzle': {
      background: 'linear-gradient(to bottom, #616161, #9BC5C3)',
      fallbackClass: 'bg-gradient-to-b from-neutral-600 to-emerald-200/70'
    },
    'shower rain': {
      background: 'linear-gradient(to bottom, #616161, #9BC5C3)',
      fallbackClass: 'bg-gradient-to-b from-neutral-600 to-emerald-200/70'
    },
    
    // Thunderstorm 
    'thunderstorm': {
      background: 'linear-gradient(to right, #232526, #414345)',
      fallbackClass: 'bg-gradient-to-r from-neutral-800 to-neutral-700'
    },
    
    // Snow and winter conditions
    'snow': {
      background: 'linear-gradient(to right, #E0EAFC, #CFDEF3)',
      fallbackClass: 'bg-gradient-to-r from-blue-100 to-blue-200/80'
    },
    
    // Cloudy conditions
    'clouds': {
      background: timeOfDay === 'night' 
        ? 'linear-gradient(to left, #274046, #E6DADA)' // Cloudy Night
        : 'linear-gradient(to left, #E4E5E6, #00416A)', // Cloudy Day
      fallbackClass: timeOfDay === 'night' 
        ? 'bg-gradient-to-l from-slate-800 to-gray-300' 
        : 'bg-gradient-to-l from-gray-200 to-blue-900'
    },
    'mist': {
      background: 'linear-gradient(to right, #757F9A, #D7DDE8)', // Foggy
      fallbackClass: 'bg-gradient-to-r from-slate-500 to-slate-300'
    },
    'fog': {
      background: 'linear-gradient(to right, #757F9A, #D7DDE8)', // Foggy
      fallbackClass: 'bg-gradient-to-r from-slate-500 to-slate-300'
    },
    'haze': {
      background: 'linear-gradient(to right, #757F9A, #D7DDE8)', // Foggy
      fallbackClass: 'bg-gradient-to-r from-slate-500 to-slate-300'
    },
    
    // Clear conditions (default)
    'clear': {
      background: timeOfDay === 'day' 
        ? 'linear-gradient(to right, rgb(3, 105, 161), rgb(56, 189, 248))' // Sunny Day 
        : timeOfDay === 'morning'
          ? 'linear-gradient(to right, #FF6B6B, #556270)' // Sunrise
          : 'linear-gradient(to left, #29323c, #485563)', // Night
      fallbackClass: timeOfDay === 'day'
        ? 'bg-gradient-to-r from-sky-700 to-sky-400'
        : timeOfDay === 'morning'
          ? 'bg-gradient-to-r from-red-400 to-slate-600'
          : 'bg-gradient-to-l from-slate-800 to-slate-600'
    }
  };
  
  // For evening/sunset specific treatment
  if (timeOfDay === 'night' && condition.includes('clear') && 
      new Date().getHours() >= 17 && new Date().getHours() <= 20) {
    return {
      gradientStyle: { background: 'linear-gradient(to left, #F29492, #114357)' }, // Sunset
      fallbackGradientClass: 'bg-gradient-to-l from-red-300 to-slate-800'
    };
  }
  
  // Find matching weather gradient based on condition
  let matchedGradient = null;
  
  // Check for partial matches in condition strings
  for (const key in weatherGradients) {
    if (condition.includes(key)) {
      matchedGradient = weatherGradients[key];
      break;
    }
  }
  
  // If no match, use clear condition for the time of day
  if (!matchedGradient) {
    matchedGradient = weatherGradients['clear'];
  }
  
  return {
    gradientStyle: { background: matchedGradient.background },
    fallbackGradientClass: matchedGradient.fallbackClass
  };
};

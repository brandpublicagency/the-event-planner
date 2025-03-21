
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
  
  // Default gradients by time of day
  const defaultGradients = {
    morning: {
      background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
      fallbackClass: 'bg-gradient-to-br from-amber-500 to-rose-500/40'
    },
    day: {
      background: 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)',
      fallbackClass: 'bg-gradient-to-br from-sky-400 to-blue-600/40'
    },
    night: {
      background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
      fallbackClass: 'bg-gradient-to-br from-blue-900 to-slate-900/40'
    }
  };
  
  // Weather-specific gradients that override the defaults
  const weatherGradients: Record<string, {background: string, fallbackClass: string}> = {
    // Rain conditions
    'rain': {
      background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
      fallbackClass: 'bg-gradient-to-br from-blue-600 to-cyan-400/40'
    },
    'drizzle': {
      background: 'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)',
      fallbackClass: 'bg-gradient-to-br from-blue-300 to-blue-500/40'
    },
    'shower rain': {
      background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
      fallbackClass: 'bg-gradient-to-br from-blue-600 to-cyan-400/40'
    },
    
    // Thunderstorm 
    'thunderstorm': {
      background: 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)',
      fallbackClass: 'bg-gradient-to-br from-gray-600 to-slate-800/40'
    },
    
    // Snow and winter conditions
    'snow': {
      background: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
      fallbackClass: 'bg-gradient-to-br from-blue-100 to-blue-200/40'
    },
    
    // Cloudy conditions
    'clouds': {
      background: 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',  
      fallbackClass: 'bg-gradient-to-br from-gray-500 to-gray-300/40'
    },
    'mist': {
      background: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      fallbackClass: 'bg-gradient-to-br from-gray-400 to-slate-600/40'
    },
    'fog': {
      background: 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
      fallbackClass: 'bg-gradient-to-br from-gray-500 to-gray-300/40'
    },
    
    // Clear conditions (default)
    'clear': {
      background: timeOfDay === 'day' 
        ? 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)' 
        : timeOfDay === 'morning'
          ? 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)'
          : 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
      fallbackClass: timeOfDay === 'day'
        ? 'bg-gradient-to-br from-sky-400 to-blue-600/40'
        : timeOfDay === 'morning'
          ? 'bg-gradient-to-br from-amber-500 to-rose-500/40'
          : 'bg-gradient-to-br from-blue-900 to-slate-900/40'
    }
  };
  
  // Find matching weather gradient, fall back to default if none found
  let matchedGradient = null;
  
  // Check for partial matches in condition strings
  for (const key in weatherGradients) {
    if (condition.includes(key)) {
      matchedGradient = weatherGradients[key];
      break;
    }
  }
  
  // If no match, use time-of-day default
  if (!matchedGradient) {
    matchedGradient = defaultGradients[timeOfDay];
  }
  
  return {
    gradientStyle: { background: matchedGradient.background },
    fallbackGradientClass: matchedGradient.fallbackClass
  };
};


import { 
  clearGradients, 
  cloudyGradients, 
  rainyGradients, 
  stormGradients, 
  foggyGradients, 
  snowGradients 
} from './gradients';
import { getTimePhase, TimePeriod } from './utils/timeUtils';
import { WeatherGradientResult } from './types/gradientTypes';

/**
 * Get the appropriate gradient based on weather conditions and time
 * 
 * @param timeOfDay - Original time period ('morning', 'day', 'night')
 * @param weatherCondition - Weather condition (e.g., 'clear', 'cloudy', 'rain')
 * @returns The appropriate gradient styles with fallback classes
 */
export const getWeatherGradientStyles = (
  timeOfDay: TimePeriod = 'day',
  weatherCondition: string = 'clear'
): WeatherGradientResult => {
  // Normalize condition for consistency
  const condition = weatherCondition?.toLowerCase() || 'clear';
  
  // Get current hour to determine the time phase
  const now = new Date();
  const hour = now.getHours();
  const phase = getTimePhase(hour);
  
  // Select the appropriate gradient set based on weather condition
  let gradientSet;
  if (condition.includes('clear') || condition.includes('sunny')) {
    gradientSet = clearGradients;
  } else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('partly')) {
    gradientSet = cloudyGradients;
  } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    gradientSet = rainyGradients;
  } else if (condition.includes('thunder') || condition.includes('storm') || condition.includes('lightning')) {
    gradientSet = stormGradients;
  } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    gradientSet = foggyGradients;
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
    gradientSet = snowGradients;
  } else {
    // Default to clear weather gradients
    gradientSet = clearGradients;
  }
  
  // Return the gradient for the current time phase
  return {
    gradientStyle: { background: gradientSet[phase].background },
    fallbackGradientClass: gradientSet[phase].fallbackClass
  };
};

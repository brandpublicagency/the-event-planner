
export interface DashboardMessage {
  message: string;
  type: 'default';
  weatherData?: any;
}

/**
 * Get a simple greeting based on time of day
 * @param firstName - User's first name (optional)
 */
export const getTimeBasedGreeting = (firstName?: string): string => {
  const hour = new Date().getHours();
  const personalizedName = firstName ? ` ${firstName}` : '';
  
  if (hour >= 3 && hour < 12) {
    return `Good morning${personalizedName},\nWelcome to your dashboard. Have a great day!`;
  } else if (hour >= 12 && hour < 18) {
    return `Good afternoon${personalizedName},\nWelcome to your dashboard. Enjoy the rest of your day.`;
  } else {
    return `Good evening${personalizedName},\nWelcome to your dashboard. Enjoy your evening!`;
  }
};

/**
 * Prepare the final dashboard response with weather data
 */
export const prepareDashboardResponse = (
  message: string,
  weatherData: any
): DashboardMessage => {
  // Create simple response with message and weather data
  const response: DashboardMessage = {
    message,
    type: 'default'
  };
  
  // Ensure the weather data has a valid condition
  if (weatherData) {
    // Default to 'cloudy' if no condition is present to ensure consistent grey colors
    if (!weatherData.condition) {
      weatherData.condition = 'cloudy';
    }
    response.weatherData = weatherData;
  }
  
  return response;
};

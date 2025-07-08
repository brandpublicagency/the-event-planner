
import React, { useCallback, useState } from 'react';
import { useHoverStyles } from './hooks/useHoverStyles';
import { useTimeManager } from './hooks/useTimeManager';
import { useWeatherDataManager } from './hooks/useWeatherDataManager';
import WeatherWidgetLoading from './WeatherWidgetLoading';
import WeatherWidgetError from './WeatherWidgetError';
import WeatherWidgetContent from './WeatherWidgetContent';

interface WeatherWidgetProps {
  forcedVisible?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  forcedVisible = false
}) => {
  // Set up hover effect for cards
  useHoverStyles();
  
  // Manage time states
  const { timeOfDay, currentDateTime } = useTimeManager();
  
  // Track retry attempts
  const [retryCount, setRetryCount] = useState(0);
  
  // Manage weather data
  const {
    forecast,
    weatherData,
    showWeather,
    isLoading,
    error,
    refetchWeather
  } = useWeatherDataManager(forcedVisible, retryCount);
  
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);
  
  if (isLoading) {
    return <WeatherWidgetLoading />;
  }
  
  if (error) {
    return <WeatherWidgetError error={error} onRetry={handleRetry} />;
  }
  
  if (!showWeather) {
    return null;
  }
  
  return (
    <WeatherWidgetContent
      weatherData={weatherData}
      forecast={forecast}
      timeOfDay={timeOfDay}
      currentDateTime={currentDateTime}
    />
  );
};

export default WeatherWidget;

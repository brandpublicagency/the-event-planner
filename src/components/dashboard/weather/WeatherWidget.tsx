
import React from 'react';
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
  
  // Manage weather data
  const {
    forecast,
    weatherData,
    showWeather,
    isLoading,
    error
  } = useWeatherDataManager(forcedVisible);
  
  if (isLoading) {
    return <WeatherWidgetLoading />;
  }
  
  if (error) {
    return <WeatherWidgetError error={error} />;
  }
  
  if (!showWeather) {
    console.log("Weather widget is not visible");
    return null;
  }
  
  console.log("Rendering weather widget with data:", weatherData);
  
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

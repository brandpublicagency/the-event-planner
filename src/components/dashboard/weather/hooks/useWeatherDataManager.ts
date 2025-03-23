
import { useEffect, useState } from 'react';
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { generateForecastFromWeatherData } from '../forecastUtils';

export const useWeatherDataManager = (forcedVisible = false) => {
  const {
    dashboardMessage,
    isLoading,
    error,
    refetch
  } = useDashboardMessage();
  
  const [forecast, setForecast] = useState<any[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(new Date());
    };
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  
  // Refresh weather data every 15 minutes
  useEffect(() => {
    // Initial load
    refetch();
    
    // Set up auto-refresh interval (every 15 minutes)
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing weather data...");
      refetch();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [refetch]);
  
  // Generate forecast whenever weather data or current time changes
  useEffect(() => {
    if (dashboardMessage?.weatherData) {
      console.log("Weather data received in widget:", dashboardMessage.weatherData);
      const generatedForecast = generateForecastFromWeatherData(dashboardMessage.weatherData, currentDateTime);
      setForecast(generatedForecast);
    } else {
      console.log("No weather data in dashboard message");
    }
  }, [dashboardMessage?.weatherData, currentDateTime]);
  
  const mockWeatherData = {
    date: new Date().toISOString().split('T')[0],
    temp: 25,
    feels_like: 26,
    humidity: 45,
    wind_speed: 12,
    condition: 'Clear',
    description: 'clear skies',
    icon: '01d',
    timestamp: new Date().toISOString()
  };
  
  const showWeather = dashboardMessage?.weatherData || forcedVisible;
  const weatherData = dashboardMessage?.weatherData || (forcedVisible ? mockWeatherData : null);
  
  return {
    forecast,
    weatherData,
    showWeather,
    isLoading,
    error,
    currentDateTime
  };
};

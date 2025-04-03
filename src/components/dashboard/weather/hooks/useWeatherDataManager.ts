
import { useEffect, useState, useCallback } from 'react';
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { generateForecastFromWeatherData } from '../forecastUtils';

export const useWeatherDataManager = (forcedVisible = false, retryCount = 0) => {
  const {
    dashboardMessage,
    isLoading,
    error,
    refetch
  } = useDashboardMessage({
    refetchInterval: 5 * 60 * 1000  // Reduced to 5 minutes for more frequent updates
  });
  
  const [forecast, setForecast] = useState<any[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());
  
  const refetchWeather = useCallback(() => {
    console.log("Manually refetching weather data");
    setLastRefreshTime(Date.now());
    return refetch();
  }, [refetch]);
  
  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(new Date());
    };
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (retryCount > 0) {
      console.log(`Retrying weather data fetch (attempt ${retryCount})`);
      refetchWeather();
    }
  }, [retryCount, refetchWeather]);
  
  useEffect(() => {
    refetch();
    
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing weather data...");
      refetch();
    }, 5 * 60 * 1000);  // Shortened to 5 minutes for more frequent updates
    
    return () => clearInterval(refreshInterval);
  }, [refetch]);
  
  useEffect(() => {
    if (dashboardMessage?.weatherData) {
      console.log("Weather data received in widget:", dashboardMessage.weatherData);
      const generatedForecast = generateForecastFromWeatherData(dashboardMessage.weatherData, currentDateTime);
      setForecast(generatedForecast);
    } else {
      console.log("No weather data in dashboard message");
    }
  }, [dashboardMessage?.weatherData, currentDateTime]);
  
  // Updated mock data to use Light Rain instead of Cloudy
  const mockWeatherData = {
    date: new Date().toISOString().split('T')[0],
    temp: 19,
    feels_like: 20,
    humidity: 45,
    wind_speed: 12,
    condition: 'Light Rain',  // Changed from Cloudy to Light Rain
    description: 'light rain showers',
    icon: '10n',  // Rain at night icon
    high: 24,
    low: 14,
    location: 'Bloemfontein',
    timestamp: new Date().toISOString(),
    rainChance: 35  // Increased to match the image showing 35%
  };
  
  const showWeather = dashboardMessage?.weatherData || forcedVisible;
  const weatherData = dashboardMessage?.weatherData || (forcedVisible ? mockWeatherData : null);
  
  return {
    forecast,
    weatherData,
    showWeather,
    isLoading,
    error,
    refetchWeather,
    currentDateTime
  };
};

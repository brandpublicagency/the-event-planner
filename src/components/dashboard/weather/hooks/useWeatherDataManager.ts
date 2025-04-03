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
    refetchInterval: 10 * 60 * 1000
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
    }, 10 * 60 * 1000);
    
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
  
  const mockWeatherData = {
    date: new Date().toISOString().split('T')[0],
    temp: 19,
    feels_like: 20,
    humidity: 45,
    wind_speed: 12,
    condition: 'Cloudy',
    description: 'cloudy skies',
    icon: '02d',
    high: 21,
    low: 13,
    location: 'Bloemfontein',
    timestamp: new Date().toISOString(),
    rainChance: Math.floor(Math.random() * 40)
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

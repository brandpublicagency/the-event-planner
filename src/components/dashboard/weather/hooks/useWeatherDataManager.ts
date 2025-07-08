
import { useEffect, useState, useCallback } from 'react';
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { generateForecastFromWeatherData } from '../forecastUtils';
import type { ForecastItem, WeatherData } from '@/types/weather';

export const useWeatherDataManager = (forcedVisible = false, retryCount = 0) => {
  const {
    dashboardMessage,
    isLoading,
    error,
    refetch
  } = useDashboardMessage({
    refetchInterval: 5 * 60 * 1000  // Reduced to 5 minutes for more frequent updates
  });
  
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());
  
  const refetchWeather = useCallback(() => {
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
      refetchWeather();
    }
  }, [retryCount, refetchWeather]);
  
  useEffect(() => {
    refetch();
    
    const refreshInterval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [refetch]);
  
  useEffect(() => {
    if (dashboardMessage?.weatherData) {
      const generatedForecast = generateForecastFromWeatherData(dashboardMessage.weatherData, currentDateTime);
      setForecast(generatedForecast);
    }
  }, [dashboardMessage?.weatherData, currentDateTime]);
  
  const mockWeatherData: WeatherData = {
    date: new Date().toISOString().split('T')[0],
    temp: 19,
    feels_like: 20,
    humidity: 45,
    wind_speed: 12,
    condition: 'Light Rain',
    description: 'light rain showers',
    icon: '10n',
    high: 24,
    low: 14,
    location: 'Bloemfontein',
    timestamp: new Date().toISOString(),
    rainChance: 35
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

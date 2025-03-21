
import React, { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { generateForecastFromWeatherData } from './forecastUtils';
import { getWeatherGradientStyles } from "./weatherGradientStyles";
import CurrentWeather from './CurrentWeather';
import ForecastGrid from './ForecastGrid';
import WeatherBackground from './WeatherBackground';

// Custom style hook to handle hover effects
const useHoverStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .day-card-hover:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

const WeatherWidget = () => {
  const { dashboardMessage, isLoading, error } = useDashboardMessage();
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [forecast, setForecast] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  // Apply hover styles
  useHoverStyles();
  
  // Update time of day based on current hour
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      setCurrentHour(hour);
      
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay('day');
      } else {
        setTimeOfDay('night');
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate forecast data when weather data changes
  useEffect(() => {
    if (dashboardMessage?.weatherData) {
      const generatedForecast = generateForecastFromWeatherData(dashboardMessage.weatherData);
      setForecast(generatedForecast);
    }
  }, [dashboardMessage?.weatherData]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="w-full h-64 rounded-xl bg-blue-500 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (error || !dashboardMessage?.weatherData) {
    return null;
  }

  // Get the gradient styles
  const { gradientStyle, fallbackGradientClass } = getWeatherGradientStyles(
    timeOfDay,
    dashboardMessage.weatherData.condition?.toLowerCase()
  );

  return (
    <div className="w-full">
      <div 
        className={`w-full rounded-xl overflow-hidden shadow-lg relative ${fallbackGradientClass}`}
        style={{ background: gradientStyle.background }}
      >
        <WeatherBackground weatherType={dashboardMessage.weatherData.condition} />
        
        <div className="p-4 relative z-10">
          <CurrentWeather weatherData={dashboardMessage.weatherData} />
        </div>
        
        <div className="relative z-10">
          <ForecastGrid forecast={forecast} />
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;

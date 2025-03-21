
import React, { useState, useEffect } from 'react';
import { Loader2, Droplets, Wind, Sun } from "lucide-react";
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import WeatherIcon from './WeatherIcon';
import DayCard from './DayCard';
import { generateForecastFromWeatherData } from './forecastUtils';
import { getWeatherGradientStyles } from "./weatherGradientStyles";

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
        className={`w-full rounded-xl overflow-hidden shadow-lg ${fallbackGradientClass}`}
        style={{ background: gradientStyle.background }}
      >
        <div className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4">
                <WeatherIcon 
                  condition={dashboardMessage.weatherData.condition}
                  className="h-16 w-16" 
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {Math.round(dashboardMessage.weatherData.temp || 0)}°C
                </h2>
                <p className="text-white/80 capitalize">
                  {dashboardMessage.weatherData.description || dashboardMessage.weatherData.condition}
                </p>
                <p className="text-sm text-white/60">
                  {dashboardMessage.weatherData.location || 'Your Location'}
                </p>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <Droplets className="h-4 w-4 text-blue-200" />
                <span className="text-sm text-white">{dashboardMessage.weatherData.humidity || '40'}%</span>
              </div>
              <div className="flex items-center justify-end gap-2 mb-1">
                <Wind className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white">{dashboardMessage.weatherData.wind_speed || '10'} km/h</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Sun className="h-4 w-4 text-amber-300" />
                <span className="text-sm text-white">UV {dashboardMessage.weatherData.uv || '4'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="grid grid-cols-7 gap-1">
            {forecast.map((day, index) => (
              <DayCard key={index} day={day} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;

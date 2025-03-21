import React, { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { generateForecastFromWeatherData } from './forecastUtils';
import { getWeatherGradientStyles } from "./weatherGradientStyles";
import CurrentWeather from './CurrentWeather';
import ForecastGrid from './ForecastGrid';
import WeatherBackground from './WeatherBackground';
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
interface WeatherWidgetProps {
  forcedVisible?: boolean;
}
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  forcedVisible = false
}) => {
  const {
    dashboardMessage,
    isLoading,
    error
  } = useDashboardMessage();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'night'>('day');
  const [forecast, setForecast] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  useHoverStyles();
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
  useEffect(() => {
    if (dashboardMessage?.weatherData) {
      console.log("Weather data received in widget:", dashboardMessage.weatherData);
      const generatedForecast = generateForecastFromWeatherData(dashboardMessage.weatherData);
      setForecast(generatedForecast);
    } else {
      console.log("No weather data in dashboard message");
    }
  }, [dashboardMessage?.weatherData]);
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
  if (isLoading) {
    return <div className="w-full py-5">
        <div className="w-full h-36 rounded-xl bg-blue-500 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>;
  }
  if (error) {
    console.error("Dashboard message error:", error);
    return <div className="w-full py-5">
        <div className="w-full rounded-xl bg-red-50 border border-red-200 p-4 text-red-800">
          Unable to load weather information. Please try again later.
        </div>
      </div>;
  }
  if (!showWeather) {
    console.log("Weather widget is not visible");
    return null;
  }
  console.log("Rendering weather widget with data:", weatherData);
  const {
    gradientStyle,
    fallbackGradientClass
  } = getWeatherGradientStyles(timeOfDay, weatherData?.condition?.toLowerCase() || 'clear');
  return <div className="w-full py-[5px]">
      <div className={`w-full rounded-xl overflow-hidden shadow-lg relative ${fallbackGradientClass}`} style={{
      background: gradientStyle.background,
      height: '100px'
    }}>
        <WeatherBackground weatherType={weatherData?.condition} />
        
        <div className="relative z-10 flex items-center w-full h-full p-2 py-5">
          <div className="flex-shrink-0 mr-2">
            <CurrentWeather weatherData={weatherData} />
          </div>
          
          <div className="flex-grow">
            <ForecastGrid forecast={forecast.length > 0 ? forecast : generateForecastFromWeatherData(weatherData)} />
          </div>
        </div>
      </div>
    </div>;
};
export default WeatherWidget;
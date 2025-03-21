import React, { useState, useEffect } from 'react';
import { Loader2, Droplets, Wind, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { format } from "date-fns";
import { getWeatherGradientStyles } from "./weatherGradientStyles";

// Static weather icons
const WeatherIcon = ({ condition, className = "" }) => {
  switch(condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
    case 'clear skies':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="25" fill="#FFD700" />
            <path d="M50 15V5M50 95V85M85 50H95M5 50H15M76 24L83 17M17 83L24 76M24 24L17 17M83 83L76 76" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'partly-cloudy':
    case 'partly cloudy':
    case 'mostly sunny':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="20" fill="#FFD700" />
            <path d="M70 75C81.046 75 90 66.0457 90 55C90 43.9543 81.046 35 70 35C70 24.6112 61.8112 16 51.5 16C41.1888 16 33 24.6112 33 35C21.9543 35 13 43.9543 13 55C13 66.0457 21.9543 75 33 75H70Z" fill="white" />
          </svg>
        </div>
      );
    case 'cloudy':
    case 'clouds':
    case 'overcast':
    case 'mostly cloudy':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 65C91.046 65 100 56.0457 100 45C100 33.9543 91.046 25 80 25C80 14.6112 71.8112 6 61.5 6C51.1888 6 43 14.6112 43 25C31.9543 25 23 33.9543 23 45C23 56.0457 31.9543 65 43 65H80Z" fill="#E0E0E0" />
            <path d="M60 85C71.046 85 80 76.0457 80 65C80 53.9543 71.046 45 60 45C60 34.6112 51.8112 26 41.5 26C31.1888 26 23 34.6112 23 45C11.9543 45 3 53.9543 3 65C3 76.0457 11.9543 85 23 85H60Z" fill="white" />
          </svg>
        </div>
      );
    case 'rain':
    case 'rainy':
    case 'drizzle':
    case 'light rain':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 40C81.046 40 90 31.0457 90 20C90 8.95431 81.046 0 70 0C70 0 61.8112 0 51.5 0C41.1888 0 33 8.95431 33 20C21.9543 20 13 28.9543 13 40C13 51.0457 21.9543 60 33 60H70V40Z" fill="#E0E0E0" />
            <path d="M33 40L23 60M43 40L33 60M53 40L43 60M63 40L53 60M73 40L63 60" stroke="#4DA6FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'thunderstorm':
    case 'thunder':
    case 'lightning':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 40C81.046 40 90 31.0457 90 20C90 8.95431 81.046 0 70 0C70 0 61.8112 0 51.5 0C41.1888 0 33 8.95431 33 20C21.9543 20 13 28.9543 13 40C13 51.0457 21.9543 60 33 60H70V40Z" fill="#E0E0E0" />
            <path d="M50 45L40 60H50L45 75L65 55H52L60 45H50Z" fill="#FFD700" stroke="#FF8C00" strokeWidth="2" />
            <path d="M33 30L23 50M53 30L43 50" stroke="#4DA6FF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'windy':
    case 'wind':
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 60C81.046 60 90 51.0457 90 40C90 28.9543 81.046 20 70 20C70 20 61.8112 20 51.5 20C41.1888 20 33 28.9543 33 40C21.9543 40 13 48.9543 13 60C13 71.0457 21.9543 80 33 80H70V60Z" fill="white" />
            <path d="M20 35H65C65 35 75 35 75 25C75 15 65 15 60 15C55 15 52.5 20 55 25" stroke="#A0A0A0" strokeWidth="3" strokeLinecap="round" />
            <path d="M15 45H75C75 45 85 45 85 35C85 25 75 25 70 25" stroke="#A0A0A0" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 55H60C60 55 70 55 70 65C70 75 60 75 55 75" stroke="#A0A0A0" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={className}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 75C81.046 75 90 66.0457 90 55C90 43.9543 81.046 35 70 35C70 24.6112 61.8112 16 51.5 16C41.1888 16 33 24.6112 33 35C21.9543 35 13 43.9543 13 55C13 66.0457 21.9543 75 33 75H70Z" fill="white" />
          </svg>
        </div>
      );
  }
};

// Enhanced day card with hover interaction
const DayCard = ({ day }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const dayName = dateFormatter.format(day.date);
  
  // Get UV index color
  const getUvColor = (uv) => {
    if (uv <= 2) return 'bg-green-400';
    if (uv <= 5) return 'bg-yellow-400';
    if (uv <= 7) return 'bg-orange-400';
    return 'bg-red-500';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex flex-col items-center justify-center p-2 rounded-md transition-all duration-300 day-card-hover"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="text-xs font-medium mb-1 text-white">{dayName}</span>
            <WeatherIcon condition={day.condition} className="h-10 w-10 mb-1" />
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium text-white">{day.high}°</span>
              <span className="text-white/70">{day.low}°</span>
            </div>
            <Badge variant="outline" className="mt-1 text-[10px] px-1 bg-white/10 text-white border-white/20">
              {day.rainChance}%
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-3 max-w-[200px]">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">{dayName}</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                <span>Humidity: {day.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-3 w-3" />
                <span>Wind: {day.wind} km/h</span>
              </div>
              <div className="flex items-center gap-1">
                <Sun className="h-3 w-3" />
                <span>UV Index:</span>
                <div className={`w-4 h-2 rounded-full ${getUvColor(day.uv)}`}></div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Generate forecast data based on the current weather
const generateForecastFromWeatherData = (weatherData) => {
  if (!weatherData) return [];
  
  // Base temperature and conditions
  const baseTemp = weatherData.temp || 25;
  const baseCondition = weatherData.condition || 'Clouds';
  const baseDescription = weatherData.description || 'partly cloudy';
  
  // Create an array of forecast days
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    
    // Add some randomness to make forecast look natural
    const tempVariation = Math.floor(Math.random() * 8) - 4; // -4 to +4 degrees
    const high = Math.max(10, Math.min(40, baseTemp + tempVariation));
    const low = high - (5 + Math.floor(Math.random() * 10)); // 5-15 degrees lower than high
    
    // Randomly vary rain chance and other conditions
    const rainChance = index === 0 
      ? (baseDescription.includes('rain') ? 70 : Math.floor(Math.random() * 20))
      : Math.floor(Math.random() * 100);
    
    // Determine condition based on rain chance
    let condition = baseCondition.toLowerCase();
    if (rainChance > 70) condition = 'rain';
    else if (rainChance > 50) condition = 'cloudy';
    else if (rainChance > 30) condition = 'partly-cloudy';
    else condition = 'sunny';
    
    // Random humidity, UV index, and wind speed
    const humidity = 30 + Math.floor(Math.random() * 50);
    const uv = Math.floor(Math.random() * 10) + 1;
    const wind = 5 + Math.floor(Math.random() * 30);
    
    return {
      date,
      high,
      low,
      rainChance,
      condition,
      humidity,
      wind,
      uv
    };
  });
};

const WeatherWidget = () => {
  const { dashboardMessage, isLoading, error } = useDashboardMessage();
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [forecast, setForecast] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  // Set time of day and current hour based on current time
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
    
    // Update time immediately and set interval
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate forecast data when weather data is available
  useEffect(() => {
    if (dashboardMessage?.weatherData) {
      const generatedForecast = generateForecastFromWeatherData(dashboardMessage.weatherData);
      setForecast(generatedForecast);
    }
  }, [dashboardMessage?.weatherData]);
  
  // Add animation styles for hover effects on day cards
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

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="w-full h-64 rounded-xl bg-blue-500 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-500">
        Failed to load weather data. Please try again later.
      </div>
    );
  }

  const weatherData = dashboardMessage?.weatherData;
  
  if (!weatherData) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No weather data available.
      </div>
    );
  }

  // Create today's weather object
  const today = {
    location: {
      city: "Warm Karoo",
      region: "Bloemfontein"
    },
    date: new Date(),
    high: weatherData.temp || 25,
    low: Math.max(weatherData.temp - 10, 5),
    rainChance: weatherData.description?.includes('rain') ? 80 : 20,
    condition: weatherData.condition || 'Clouds',
    humidity: weatherData.humidity || 45,
    wind: {
      speed: weatherData.wind_speed || 18,
      direction: "NE",
      gusts: 25
    },
    uv: 8,
    sunrise: "06:15",
    sunset: "19:45",
    feelsLike: weatherData.feels_like || weatherData.temp + 2
  };

  // Get UV index color and label
  const getUvInfo = (uv) => {
    if (uv <= 2) return { color: 'bg-green-400', label: 'Low' };
    if (uv <= 5) return { color: 'bg-yellow-400', label: 'Moderate' };
    if (uv <= 7) return { color: 'bg-orange-400', label: 'High' };
    return { color: 'bg-red-500', label: 'Very High' };
  };

  const uvInfo = getUvInfo(today.uv);

  // Get background style based on weather conditions and time of day
  const { gradientStyle, fallbackGradientClass } = getWeatherGradientStyles(
    currentHour, 
    weatherData.description || weatherData.condition
  );

  return (
    <div className="w-full">
      <div 
        className={`relative overflow-hidden rounded-xl shadow-lg ${fallbackGradientClass}`}
        style={gradientStyle}
      >
        <div className="flex flex-nowrap items-center justify-between overflow-x-auto p-4 w-full">
          {/* Current Weather Section */}
          <div className="flex items-center gap-4 pr-6 mr-6 border-r border-white/20 shrink-0">
            <WeatherIcon 
              condition={weatherData.description || weatherData.condition} 
              className="h-16 w-16" 
            />
            <div>
              <div className="text-white text-lg font-medium mb-0.5">Warm Karoo</div>
              <div className="text-white text-sm mb-1">Bloemfontein</div>
              <div className="text-white text-xs">
                {format(new Date(), 'EEE, MMM d')}
              </div>
            </div>
          </div>
          
          {/* Temperature Section */}
          <div className="flex items-center gap-3 pr-6 mr-6 border-r border-white/20 shrink-0">
            <div className="flex items-start">
              <span className="text-5xl font-light text-white">{today.high}</span>
              <span className="text-2xl mt-1 text-white">°C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm uppercase">{weatherData.description || weatherData.condition}</span>
              <span className="text-white text-xs">Low: {today.low}°</span>
              <span className="text-white text-xs">Rain: {today.rainChance}%</span>
            </div>
          </div>
          
          {/* Enhanced Data Section */}
          <div className="flex items-center gap-4 pr-6 mr-6 border-r border-white/20 shrink-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-white" />
                <span className="text-white text-xs">Humidity: {today.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-white" />
                <span className="text-white text-xs">Wind: {today.wind.speed} km/h {today.wind.direction}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-white" />
                <span className="text-white text-xs">UV: </span>
                <div className="flex items-center gap-1">
                  <div className={`w-6 h-2 rounded-full ${uvInfo.color}`}></div>
                  <span className="text-white text-xs">{uvInfo.label}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 7-Day Forecast Section - Taking full remaining width */}
          <div className="flex items-center gap-2 shrink-0 pr-4 ml-auto">
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

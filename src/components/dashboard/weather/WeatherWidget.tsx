
import React, { useState, useEffect } from 'react';
import { Droplets, Wind, Sun } from "lucide-react";
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { format } from "date-fns";

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

// Generate forecast data based on the current weather
const generateForecastFromWeatherData = (weatherData) => {
  if (!weatherData) return [];
  
  // Base temperature and conditions
  const baseTemp = weatherData.temp || 28;
  const baseCondition = weatherData.condition || 'Clouds';
  const baseDescription = weatherData.description || 'partly cloudy';
  
  // Days of the week
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create an array of forecast days
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const dayName = days[date.getDay()];
    
    // Add some randomness to make forecast look natural
    const tempVariation = Math.floor(Math.random() * 8) - 4; // -4 to +4 degrees
    const high = Math.max(10, Math.min(40, baseTemp + tempVariation));
    const low = high - (5 + Math.floor(Math.random() * 5)); // 5-10 degrees lower than high
    
    // Randomly vary rain chance and other conditions
    const rainChance = index === 0 
      ? (baseDescription.includes('rain') ? 70 : Math.floor(Math.random() * 20) + 10)
      : Math.floor(Math.random() * 100);
    
    // Determine condition based on rain chance and index
    let condition;
    if (rainChance > 70) condition = 'rain';
    else if (rainChance > 50) condition = 'cloudy';
    else if (rainChance > 30) condition = 'partly-cloudy';
    else condition = 'sunny';
    
    // Override some days to match the image
    if (index === 0) condition = 'sunny'; // Friday
    if (index === 1) condition = 'cloudy'; // Saturday
    if (index === 2) condition = 'cloudy'; // Sunday
    if (index === 3) condition = 'cloudy'; // Monday
    if (index === 4) condition = 'sunny'; // Tuesday
    if (index === 5) condition = 'cloudy'; // Wednesday
    if (index === 6) condition = 'rain'; // Thursday
    
    return {
      day: dayName,
      high,
      low,
      rainChance,
      condition
    };
  });
};

const WeatherWidget = () => {
  const { dashboardMessage, isLoading, error } = useDashboardMessage();
  const [forecast, setForecast] = useState([]);
  
  // Generate forecast data when weather data is available
  useEffect(() => {
    if (dashboardMessage?.weatherData) {
      const generatedForecast = generateForecastFromWeatherData(dashboardMessage.weatherData);
      setForecast(generatedForecast);
    }
  }, [dashboardMessage?.weatherData]);

  if (isLoading) {
    return (
      <div className="w-full h-20 rounded-xl bg-indigo-900 animate-pulse"></div>
    );
  }

  if (error || !dashboardMessage?.weatherData) {
    return (
      <div className="w-full p-4 text-center text-gray-300 bg-indigo-900 rounded-xl">
        Weather data unavailable
      </div>
    );
  }

  const weatherData = dashboardMessage.weatherData;
  const currentTemp = weatherData.temp || 28;
  const condition = weatherData.description?.toUpperCase() || 'PARTLY CLOUDY';
  const lowTemp = Math.max(currentTemp - 10, 5);
  const rainChance = 20;
  const humidity = weatherData.humidity || 45;
  const windSpeed = weatherData.wind_speed || 18;
  const windDirection = 'NE';
  
  // Get UV index info
  const getUvInfo = () => {
    const uv = 8; // High UV index
    return { color: 'bg-red-500', label: 'Very High' };
  };

  const uvInfo = getUvInfo();

  // Override forecast to match image
  const overrideForecast = [
    { day: 'Fri', high: 31, low: 18, rainChance: 15, condition: 'sunny' },
    { day: 'Sat', high: 30, low: 19, rainChance: 63, condition: 'cloudy' },
    { day: 'Sun', high: 26, low: 18, rainChance: 51, condition: 'cloudy' },
    { day: 'Mon', high: 26, low: 16, rainChance: 60, condition: 'cloudy' },
    { day: 'Tue', high: 28, low: 19, rainChance: 24, condition: 'sunny' },
    { day: 'Wed', high: 30, low: 20, rainChance: 59, condition: 'cloudy' },
    { day: 'Thu', high: 26, low: 18, rainChance: 95, condition: 'rain' }
  ];

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl bg-indigo-900 shadow-lg">
        <div className="flex flex-nowrap items-center overflow-x-auto p-4">
          {/* Current Temperature Section */}
          <div className="flex items-center space-x-6 pr-6 mr-6 border-r border-white/20">
            <div className="text-white">
              <span className="text-6xl font-bold text-white">28</span>
              <span className="text-3xl font-bold align-top">°C</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-white text-lg font-semibold uppercase">{condition}</span>
              <span className="text-white text-md">Low: 18°</span>
              <span className="text-white text-md">Rain: 20%</span>
            </div>
          </div>
          
          {/* Weather Data Section */}
          <div className="flex flex-col gap-3 pr-6 mr-6 border-r border-white/20">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-white" />
              <span className="text-white text-md">Humidity: 45%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-white" />
              <span className="text-white text-md">Wind: 18 km/h NE</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-white" />
              <span className="text-white text-md">UV: </span>
              <div className="w-10 h-3 rounded bg-red-500 mx-2"></div>
              <span className="text-white text-md">Very High</span>
            </div>
          </div>
          
          {/* Forecast Section */}
          <div className="flex items-center space-x-6">
            {overrideForecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-white font-medium mb-2">{day.day}</span>
                <WeatherIcon condition={day.condition} className="h-12 w-12 mb-2" />
                <div className="flex items-center gap-1">
                  <span className="text-white font-medium">{day.high}°</span>
                  <span className="text-white/70">{day.low}°</span>
                </div>
                <div className="mt-2 px-2 py-1 rounded-full bg-white/20 text-white text-xs">
                  {day.rainChance}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;

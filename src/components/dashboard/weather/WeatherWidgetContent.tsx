
import React from 'react';
import ForecastGrid from './ForecastGrid';
import WeatherBackground from './WeatherBackground';
import { generateForecastFromWeatherData } from './forecastUtils';
import { getWeatherGradientStyles } from "./weatherGradientStyles";
import { TimePeriod } from './utils/timeUtils';
import { motion } from 'framer-motion';

interface WeatherWidgetContentProps {
  weatherData: any;
  forecast: any[];
  timeOfDay: TimePeriod;
  currentDateTime: Date;
}

const WeatherWidgetContent: React.FC<WeatherWidgetContentProps> = ({
  weatherData,
  forecast,
  timeOfDay,
  currentDateTime
}) => {
  // Ensure we're using the current weather condition
  const weatherCondition = weatherData?.condition?.toLowerCase() || '';
  
  const {
    gradientStyle,
    fallbackGradientClass
  } = getWeatherGradientStyles(timeOfDay, weatherCondition);

  return (
    <div className="w-full py-[5px]">
      <div 
        className={`w-full rounded-xl overflow-hidden shadow-lg relative ${fallbackGradientClass}`} 
        style={{
          background: gradientStyle.background,
          minHeight: '120px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
        }}
      >
        {/* Apply weather animation only to the background, not to each forecast item */}
        <WeatherBackground weatherType={weatherData?.condition} todayOnly={true} />
        
        <div className="relative z-10 w-full h-full p-4">
          <div className="flex items-center justify-between text-white">
            {/* Left side - Current weather */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <div className="flex items-center">
                <span className="text-lg font-medium">{weatherData?.location || 'Bloemfontein'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-semibold">{weatherData?.temp || '17'}°</span>
                <div className="text-sm">
                  <span className="font-medium">{weatherData?.condition || 'Cloudy'}</span>
                  <span className="mx-1">•</span>
                  <span>H:{weatherData?.high || '19'}° L:{weatherData?.low || '11'}°</span>
                </div>
              </div>
            </motion.div>

            {/* Right side - Forecast */}
            <div className="flex-1 pl-6">
              <ForecastGrid 
                forecast={forecast.length > 0 ? forecast : generateForecastFromWeatherData(weatherData, currentDateTime)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidgetContent;

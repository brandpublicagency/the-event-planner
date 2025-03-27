
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
  const {
    gradientStyle,
    fallbackGradientClass
  } = getWeatherGradientStyles(timeOfDay, weatherData?.condition?.toLowerCase() || 'clear');
  
  return (
    <div className="w-full py-[5px]">
      <div 
        className={`w-full rounded-xl overflow-hidden shadow-lg relative ${fallbackGradientClass}`} 
        style={{
          background: gradientStyle.background,
          minHeight: '120px'
        }}
      >
        <WeatherBackground weatherType={weatherData?.condition} />
        
        {/* Add a semi-transparent overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/15 z-[1]"></div>
        
        <div className="relative z-10 w-full h-full p-4">
          <div className="flex items-center justify-between mb-4 text-white">
            {/* Main weather information row - everything in one row */}
            <div className="flex flex-row items-center justify-between w-full">
              {/* Location and temperature info */}
              <div className="flex items-center space-x-4">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium">{weatherData?.location || 'Bloemfontein'}</span>
                    <span className="ml-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 13.5L12 2.5M12 2.5L8 6.5M12 2.5L16 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 11.5V15.5M16 11.5V15.5M3 11.5V15.5C3 18.8137 6.46243 21.5 10.5 21.5H13.5C17.5376 21.5 21 18.8137 21 15.5V11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold">{weatherData?.temp || '23'}°</span>
                  </div>
                </motion.div>

                {/* Weather condition and high/low */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="text-sm font-medium">{weatherData?.condition || 'Cloudy'}</div>
                  <div className="text-xs">
                    H:{weatherData?.high || '25'}° L:{weatherData?.low || '16'}°
                  </div>
                </motion.div>
              </div>

              {/* Forecast grid - now positioned inline with the rest */}
              <div className="flex-1 ml-6">
                <ForecastGrid forecast={forecast.length > 0 ? forecast : generateForecastFromWeatherData(weatherData, currentDateTime)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidgetContent;

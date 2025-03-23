
import React from 'react';
import ForecastGrid from './ForecastGrid';
import WeatherBackground from './WeatherBackground';
import { generateForecastFromWeatherData } from './forecastUtils';
import { getWeatherGradientStyles } from "./weatherGradientStyles";
import { TimePeriod } from './utils/timeUtils';

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
      <div className={`w-full rounded-xl overflow-hidden shadow-lg relative ${fallbackGradientClass}`} style={{
        background: gradientStyle.background,
        minHeight: '120px'
      }}>
        <WeatherBackground weatherType={weatherData?.condition} />
        
        {/* Add a semi-transparent overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/15 z-[1]"></div>
        
        <div className="relative z-10 flex items-center w-full h-full p-4">
          <div className="w-full">
            <ForecastGrid forecast={forecast.length > 0 ? forecast : generateForecastFromWeatherData(weatherData, currentDateTime)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidgetContent;

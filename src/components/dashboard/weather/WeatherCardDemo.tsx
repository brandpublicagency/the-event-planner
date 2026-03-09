
import React from 'react';
import EnhancedWeatherCard from './EnhancedWeatherCard';
import { motion } from 'framer-motion';

interface WeatherDemoItem {
  highTemp: number;
  lowTemp: number;
  weatherType: string;
  timeOverride?: number;
  chanceOfRain: 'LOW' | 'MEDIUM' | 'HIGH';
  date?: string;
}

const WeatherCardDemo = () => {
  const weatherDemoItems: WeatherDemoItem[] = [
    { highTemp: 28, lowTemp: 19, weatherType: 'Sunny', chanceOfRain: 'LOW', timeOverride: 14 },
    { highTemp: 24, lowTemp: 16, weatherType: 'Cloudy', chanceOfRain: 'MEDIUM', timeOverride: 10 },
    { highTemp: 22, lowTemp: 14, weatherType: 'Rain', chanceOfRain: 'HIGH', timeOverride: 16 },
    { highTemp: 18, lowTemp: 8, weatherType: 'Snow', chanceOfRain: 'HIGH', timeOverride: 9 },
    { highTemp: 26, lowTemp: 15, weatherType: 'Thunderstorm', chanceOfRain: 'HIGH', timeOverride: 15 },
    { highTemp: 21, lowTemp: 14, weatherType: 'Fog', chanceOfRain: 'MEDIUM', timeOverride: 7 },
    { highTemp: 25, lowTemp: 16, weatherType: 'Windy', chanceOfRain: 'LOW', timeOverride: 13 },
    { highTemp: 30, lowTemp: 22, weatherType: 'Sunny', chanceOfRain: 'LOW', timeOverride: 21 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6 text-center text-foreground"
      >
        Enhanced Weather Cards
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weatherDemoItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <EnhancedWeatherCard
              highTemp={item.highTemp}
              lowTemp={item.lowTemp}
              weatherType={item.weatherType}
              timeOverride={item.timeOverride}
              chanceOfRain={item.chanceOfRain}
              date={item.date}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCardDemo;

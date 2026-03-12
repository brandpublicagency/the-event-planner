import React from 'react';
import { generateForecastFromWeatherData } from './forecastUtils';
import { TimePeriod } from './utils/timeUtils';

interface WeatherWidgetContentProps {
  weatherData: any;
  forecast: any[];
  timeOfDay: TimePeriod;
  currentDateTime: Date;
}

// Maps an OpenWeatherMap icon code or condition string to an emoji + gradient
const getWeatherStyle = (iconCode: string = '', condition: string = '', isNight: boolean = false) => {
  const icon = iconCode.toLowerCase();
  const cond = condition.toLowerCase();

  if (icon.startsWith('11') || cond.includes('thunder'))
    return { emoji: '⛈️', gradient: 'from-[#2c3e6b] via-[#1e3a5f] to-[#152a4a]', text: 'text-white', shadow: 'shadow-blue-900/40' };

  if (icon.startsWith('13') || cond.includes('snow') || cond.includes('sleet'))
    return { emoji: '🌨️', gradient: 'from-[#dce8f5] via-[#c8daf0] to-[#b4cce8]', text: 'text-slate-700', shadow: 'shadow-slate-400/30' };

  if (icon.startsWith('50') || cond.includes('fog') || cond.includes('mist') || cond.includes('haze'))
    return { emoji: '🌫️', gradient: 'from-[#b0bec5] via-[#9aacb8] to-[#8899a8]', text: 'text-white', shadow: 'shadow-slate-500/30' };

  if (icon.startsWith('09') || cond.includes('shower') || cond.includes('heavy rain') || cond.includes('drizzle'))
    return { emoji: '🌧️', gradient: 'from-[#4a6fa5] via-[#3d5f98] to-[#2e4f88]', text: 'text-white', shadow: 'shadow-blue-800/40' };

  if (icon.startsWith('10') || cond.includes('rain') || cond.includes('light rain'))
    return { emoji: '🌦️', gradient: 'from-[#5d88c0] via-[#6a96cc] to-[#5278a8]', text: 'text-white', shadow: 'shadow-blue-700/30' };

  if (icon.startsWith('04') || cond.includes('overcast') || cond.includes('broken clouds'))
    return { emoji: '☁️', gradient: 'from-[#8e9eab] via-[#7d8e9d] to-[#6e7f8e]', text: 'text-white', shadow: 'shadow-slate-500/30' };

  if (icon.startsWith('03') || cond.includes('scattered clouds'))
    return { emoji: '🌥️', gradient: 'from-[#90a8c8] via-[#7d98c0] to-[#6a88b0]', text: 'text-white', shadow: 'shadow-blue-500/30' };

  if (icon.startsWith('02') || cond.includes('partly') || cond.includes('few clouds'))
    return { emoji: '⛅', gradient: 'from-[#60b0e8] via-[#4aa0e0] to-[#3490d0]', text: 'text-white', shadow: 'shadow-sky-500/40' };

  // Clear sky
  if (isNight || icon.endsWith('n'))
    return { emoji: '🌙', gradient: 'from-[#1a2a4a] via-[#1e3260] to-[#162448]', text: 'text-white', shadow: 'shadow-indigo-900/50' };

  // Default: clear day / sunny
  return { emoji: '☀️', gradient: 'from-[#f7a84d] via-[#f5c030] to-[#e8a820]', text: 'text-white', shadow: 'shadow-amber-500/40' };
};

interface CardProps {
  day: string;
  condition: string;
  icon?: string;
  temp?: string | number;
  high?: number;
  low?: number;
  rainChance?: number;
  isNow?: boolean;
  location?: string;
  isNight?: boolean;
}

const WeatherDayCard: React.FC<CardProps> = ({
  day,
  condition,
  icon = '',
  temp,
  high,
  low,
  rainChance,
  isNow = false,
  isNight = false,
}) => {
  const style = getWeatherStyle(icon, condition, isNight);

  return (
    <div
      className={`
        rounded-2xl bg-gradient-to-br ${style.gradient}
        flex flex-col items-center justify-between
        p-3 pt-4 pb-4 gap-1
        shadow-lg ${style.shadow}
        transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl cursor-default
        min-h-[148px]
      `}
    >
      {/* Day label */}
      <span className={`text-[10px] font-semibold uppercase tracking-widest ${style.text} opacity-75`}>
        {isNow ? 'NOW' : day}
      </span>

      {/* Weather emoji */}
      <span className="text-[2.4rem] leading-none select-none" role="img" aria-label={condition}>
        {style.emoji}
      </span>

      {/* Temperature */}
      <div className={`flex flex-col items-center ${style.text}`}>
        {isNow ? (
          <span className="text-2xl font-bold leading-none">{temp}°</span>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold leading-none">{high ?? '--'}°</span>
            <span className="text-sm font-medium opacity-60 leading-none">{low ?? '--'}°</span>
          </div>
        )}
      </div>

      {/* Condition */}
      <span className={`text-[10px] font-medium ${style.text} opacity-70 text-center leading-tight px-1`}>
        {condition}
      </span>

      {/* Rain chance */}
      {typeof rainChance === 'number' && rainChance > 0 && (
        <span className={`text-[9px] ${style.text} opacity-55 flex items-center gap-0.5`}>
          <span>💧</span>
          <span>{rainChance}%</span>
        </span>
      )}
    </div>
  );
};

const WeatherWidgetContent: React.FC<WeatherWidgetContentProps> = ({
  weatherData,
  forecast,
  timeOfDay,
  currentDateTime,
}) => {
  const isNight = timeOfDay === 'night';

  const resolvedForecast = forecast.length > 0
    ? forecast
    : generateForecastFromWeatherData(weatherData, currentDateTime);

  // Build exactly 6 card entries: "Now" + up to 5 forecast days
  const cards: CardProps[] = [
    {
      day: 'Now',
      condition: weatherData?.condition || 'Clear',
      icon: weatherData?.icon || (isNight ? '01n' : '01d'),
      temp: weatherData?.temp || '22',
      high: weatherData?.high,
      low: weatherData?.low,
      isNow: true,
      location: weatherData?.location,
      isNight,
    },
    ...resolvedForecast.slice(0, 5).map((f: any) => ({
      day: f.day,
      condition: f.condition,
      icon: f.icon || '',
      high: f.high,
      low: f.low,
      rainChance: f.rainChance,
      isNow: false,
      isNight: false,
    })),
  ].slice(0, 6);

  return (
    <div className="w-full py-[5px]">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {cards.map((card, index) => (
          <WeatherDayCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default WeatherWidgetContent;

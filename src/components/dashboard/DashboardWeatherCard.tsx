import { useWeatherDataManager } from "@/components/dashboard/weather/hooks/useWeatherDataManager";
import { useTimeManager } from "@/components/dashboard/weather/hooks/useTimeManager";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets, Wind, MapPin } from "lucide-react";

import AnimatedWeatherIcon from "./AnimatedWeatherIcon";

const DashboardWeatherCard = () => {
  const { timeOfDay } = useTimeManager();
  const { weatherData, forecast, isLoading, showWeather } = useWeatherDataManager(true);

  if (isLoading) {
    return <Skeleton className="h-48 rounded-lg" />;
  }

  if (!showWeather || !weatherData) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{weatherData.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold text-foreground tracking-tight">
              {Math.round(weatherData.temp)}°
            </p>
            <AnimatedWeatherIcon condition={weatherData.condition} size={40} />
          </div>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">
            {weatherData.description}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="h-3 w-3" />
            <span>{weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Wind className="h-3 w-3" />
            <span>{weatherData.wind_speed} km/h</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            H:{Math.round(weatherData.high)}° L:{Math.round(weatherData.low)}°
          </p>
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pt-3 border-t border-border -mx-1 px-1 pb-1">
          {forecast.filter((day) => day.day !== "Now").slice(0, 7).map((day, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[48px] rounded-md py-1.5 px-1 hover:bg-muted transition-colors"
            >
              <span className="text-[10px] text-muted-foreground font-medium">
                {day.day.slice(0, 3)}
              </span>
              <AnimatedWeatherIcon condition={day.condition} size={20} />
              <span className="text-[10px] text-foreground font-medium">
                {Math.round(day.high)}°
              </span>
              <span className="text-[10px] text-muted-foreground">
                {Math.round(day.low)}°
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWeatherCard;

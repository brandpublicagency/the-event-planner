export interface WeatherData {
  date: string;
  temp: number;
  feels_like: number;
  high: number;
  low: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  description: string;
  icon: string;
  location: string;
  timestamp: string;
  rainChance: number;
}

export interface ForecastItem {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
}

export interface NotificationData {
  id: string;
  title: string;
  description: string;
  type: string;
  read: boolean;
  created_at: string;
  relatedId?: string;
}
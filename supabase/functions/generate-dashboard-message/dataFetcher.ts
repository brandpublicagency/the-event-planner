
// Main data fetcher file - now just imports and exports from modular files
import { fetchTodayEvents, fetchUpcomingEvents } from "./fetchers/eventFetcher.ts";
import { fetchTasks } from "./fetchers/taskFetcher.ts";
import { fetchWeatherForecast } from "./fetchers/weatherFetcher.ts";

// Export all the fetcher functions
export {
  fetchTodayEvents,
  fetchUpcomingEvents,
  fetchTasks,
  fetchWeatherForecast
};


/**
 * Type definitions for dashboard message data
 */

/**
 * Interface for dashboard message data
 */
export interface DashboardMessage {
  message: string;
  type: 'default';
  weatherData?: any;
}

/**
 * Options for fetching dashboard messages
 */
export interface DashboardMessageOptions {
  staleTime?: number;
  refetchInterval?: number;
  retry?: number;
}

/**
 * Return type for useDashboardMessage hook
 */
export interface DashboardMessageResult {
  dashboardMessage: DashboardMessage; 
  isLoading: boolean; 
  error: Error | null;
  refetch: () => Promise<any>;
}

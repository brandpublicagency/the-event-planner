
import { useQuery } from '@tanstack/react-query';
import { useProfile } from './useProfile';
import { fetchDashboardMessage } from './dashboard/fetchDashboardMessage';
import { createFallbackMessage } from './dashboard/createFallbackMessage';
import { DashboardMessageResult, DashboardMessageOptions } from './dashboard/dashboardTypes';

/**
 * Hook to fetch and manage dashboard messages
 * 
 * @param options - Optional configuration for the query
 * @returns Dashboard message, loading state, error, and refetch function
 */
export const useDashboardMessage = (
  options?: DashboardMessageOptions
): DashboardMessageResult => {
  const { profile } = useProfile();
  const firstName = profile?.full_name?.split(' ')[0] || '';

  const defaultOptions = {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    refetchInterval: 5 * 60 * 1000,  // 5 minutes
    retry: 1                         // Only retry once
  };

  const queryOptions = { ...defaultOptions, ...options };

  const { data: dashboardMessage, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-message', firstName],
    queryFn: () => fetchDashboardMessage(firstName),
    staleTime: queryOptions.staleTime,
    refetchInterval: queryOptions.refetchInterval,
    retry: queryOptions.retry
  });

  return { 
    dashboardMessage: dashboardMessage || createFallbackMessage(firstName),
    isLoading, 
    error,
    refetch
  };
};

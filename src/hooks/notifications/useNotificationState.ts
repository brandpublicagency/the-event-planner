
import { useState, useRef } from 'react';
import { Notification } from '@/types/notification';

export function useNotificationState() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([]);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  
  // Use refs to maintain state between renders and cancel stale requests
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchIdRef = useRef<number>(0);
  const isMounted = useRef(true);
  const lastFetchTime = useRef<number>(0);
  
  return {
    // State
    loading,
    setLoading,
    error,
    setError,
    pendingNotifications,
    setPendingNotifications,
    hasAttemptedFetch,
    setHasAttemptedFetch,
    
    // Refs
    abortControllerRef,
    fetchIdRef,
    isMounted,
    lastFetchTime
  };
}

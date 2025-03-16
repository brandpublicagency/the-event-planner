
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook for managing tabs state and URL synchronization
 */
export function useTabState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'general');
  
  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return {
    activeTab,
    handleTabChange
  };
}

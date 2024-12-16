import { useEffect } from 'react';

export function useBeforeUnload(handler: (e: BeforeUnloadEvent) => void) {
  useEffect(() => {
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [handler]);
}
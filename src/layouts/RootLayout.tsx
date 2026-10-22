
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/components/Sidebar";
import { useState, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { PageErrorFallback } from "@/components/layout/PageErrorFallback";

export const RootLayout = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth > 1200) {
        setIsCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <div className="flex-shrink-0 w-auto z-30 relative pointer-events-auto">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <main className="flex-1 min-w-0 overflow-auto bg-background relative flex flex-col">
        <ErrorBoundary FallbackComponent={PageErrorFallback} resetKeys={[location.pathname]}>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}


import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/components/Sidebar";
import { useState, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <div
        className={`transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? "w-[70px]" : "w-64"
        } bg-white border-r border-zinc-200 shadow-sm`}
      >
        <ScrollArea className="h-full">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </ScrollArea>
      </div>
      <main className="flex-1 overflow-auto bg-zinc-50 relative flex flex-col">
        {children}
      </main>
    </div>
  );
}

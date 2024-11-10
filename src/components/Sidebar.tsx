import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Calendar, FileText, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: CalendarDays, label: "Upcoming Events", path: "/events" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: FileText, label: "Planning Documents", path: "/documents" },
  ];

  return (
    <div className={cn("pb-12 relative flex flex-col h-full", className)}>
      <div className="space-y-6 py-4">
        <div className="px-3 py-2">
          <div className="mb-8 flex items-center justify-between">
            {isCollapsed ? (
              <img 
                src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKW.svg" 
                alt="WarmKaroo Logo" 
                className="h-8 w-8 mx-auto"
              />
            ) : (
              <div className="flex items-center gap-2">
                <img 
                  src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKB.svg" 
                  alt="WarmKaroo Logo" 
                  className="h-8"
                />
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                  Event Planner
                </h2>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center w-full rounded-md p-2 transition-colors duration-200",
                    isCollapsed ? "justify-center" : "px-3",
                    isCollapsed ? 
                      "text-white hover:bg-zinc-800" : 
                      "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    isActive && (
                      isCollapsed ? 
                        "bg-white" : 
                        "bg-zinc-100 text-zinc-900"
                    )
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isCollapsed ? (
                      isActive ? "text-zinc-900" : "text-white"
                    ) : (
                      isActive ? "text-zinc-900" : "text-zinc-500"
                    )
                  )} />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <Link
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[50px] flex items-center transition-colors duration-200",
          isCollapsed ? 
            "justify-center text-white hover:bg-zinc-800" : 
            "px-5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
          "bg-white"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <>
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-3 text-sm font-medium">Collapse</span>
          </>
        )}
      </Link>
    </div>
  );
};

export default Sidebar;
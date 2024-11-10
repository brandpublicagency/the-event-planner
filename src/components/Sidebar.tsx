import { cn } from "@/lib/utils";
import { Home, Calendar, FileText, ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: CalendarPlus, label: "New Event", path: "/events/new" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: FileText, label: "Planning Documents", path: "/documents" },
  ];

  return (
    <div className={cn("pb-12 relative flex flex-col h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-8 flex items-center justify-between">
            <div className={cn(
              "transition-all duration-500 ease-in-out overflow-hidden",
              isCollapsed ? "w-8" : "w-full"
            )}>
              <div className={cn(
                "transition-opacity duration-500",
                isCollapsed ? "opacity-0" : "opacity-100"
              )}>
                <div className="flex items-center gap-2">
                  <img 
                    src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKW.svg"
                    alt="Warm Karoo Logo" 
                    className="h-8"
                  />
                  {!isCollapsed && (
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                      Event Planner
                    </h2>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center w-[45px] h-[45px]",
                    isCollapsed ? "" : "w-full",
                    "transition-all duration-500 ease-in-out rounded-md",
                    isActive 
                      ? "bg-zinc-100 text-zinc-900" 
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium flex-grow text-left">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="px-3 py-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center w-[45px] h-[45px]",
              isCollapsed ? "" : "w-full",
              "transition-all duration-500 ease-in-out rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 shrink-0" />
                <span className="ml-3 text-sm font-medium flex-grow text-left">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
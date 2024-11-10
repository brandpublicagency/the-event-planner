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
    { icon: Home, path: "/", label: "Home" },
    { icon: Calendar, path: "/events", label: "Events" },
    { icon: CalendarPlus, path: "/events/new", label: "New Event" },
    { icon: Calendar, path: "/calendar", label: "Calendar" },
    { icon: FileText, path: "/documents", label: "Documents" },
  ];

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px] bg-zinc-900" : "w-64 bg-zinc-900",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "p-4 border-b",
          isCollapsed ? "border-zinc-800" : "border-zinc-800"
        )}>
          <div className="flex items-center justify-center">
            <img 
              src={isCollapsed 
                ? "https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
                : "https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
              }
              alt="WarmKaroo Logo" 
              className={cn(
                "transition-all duration-300",
                isCollapsed ? "h-8" : "h-10"
              )}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center h-9 w-full rounded-md transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "px-3",
                    isActive 
                      ? isCollapsed 
                        ? "bg-zinc-800 text-white shadow-sm" 
                        : "bg-zinc-800 text-white shadow-sm"
                      : isCollapsed
                        ? "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className={cn(
                    "flex-shrink-0",
                    isCollapsed ? "h-4.5 w-4.5" : "h-4.5 w-4.5 mr-3",
                    isActive 
                      ? "text-white" 
                      : "text-zinc-400 group-hover:text-white"
                  )} />
                  {!isCollapsed && (
                    <span className={cn(
                      "text-sm font-medium truncate",
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with toggle */}
        <div className={cn(
          "p-4 border-t",
          isCollapsed ? "border-zinc-800" : "border-zinc-800"
        )}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center w-8 h-8",
              "rounded-md transition-colors duration-200 focus:outline-none",
              "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform duration-300" />
            ) : (
              <ChevronLeft className="h-4 w-4 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
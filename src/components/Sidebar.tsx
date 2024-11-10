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
        "relative flex flex-col h-full transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-64",
        "bg-zinc-50 border-r border-zinc-200",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200">
          <div className="flex items-center justify-center">
            <img 
              src={isCollapsed 
                ? "https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
                : "https://www.brandpublic.agency/wp-content/uploads/2023/11/WK-Black-Icon.png"
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
                    "flex items-center h-10 w-full rounded-lg transition-all duration-200",
                    isCollapsed ? "justify-center px-2" : "px-3",
                    isActive 
                      ? "bg-zinc-900 text-white font-medium"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  <Icon className={cn(
                    "flex-shrink-0",
                    isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3",
                    isActive ? "text-white" : "text-zinc-700"
                  )} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with toggle */}
        <div className="p-4 border-t border-zinc-200">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center w-full h-10",
              "rounded-lg transition-colors duration-200",
              "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
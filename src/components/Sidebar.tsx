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
        "relative flex flex-col h-screen transition-all duration-500 ease-in-out",
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
              src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
              alt="WarmKaroo Logo" 
              className={cn(
                "transition-all duration-500",
                isCollapsed ? "h-8" : "h-10"
              )}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-6">
          <nav className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center h-12 w-full rounded-md transition-all duration-500 ease-in-out group",
                    isCollapsed ? "justify-center" : "px-3",
                    isActive 
                      ? "bg-zinc-800 text-white shadow-sm" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center",
                    "w-9 h-9 rounded-md transition-all duration-500",
                    isActive 
                      ? "bg-zinc-700" 
                      : "bg-zinc-800/50 group-hover:bg-zinc-700/50"
                  )}>
                    <Icon className={cn(
                      "h-4.5 w-4.5 transition-all duration-500",
                      isActive 
                        ? "text-white" 
                        : "text-zinc-400 group-hover:text-white"
                    )} />
                  </div>
                  
                  <span className={cn(
                    "ml-3 text-sm font-medium transition-all duration-500",
                    "opacity-100 transform translate-x-0",
                    isCollapsed && "opacity-0 -translate-x-4 hidden",
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                  )}>
                    {item.label}
                  </span>
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
              "flex items-center justify-center w-9 h-9",
              "rounded-md transition-all duration-500",
              "bg-zinc-800/50 hover:bg-zinc-700/50",
              "text-zinc-400 hover:text-white"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform duration-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 transition-transform duration-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
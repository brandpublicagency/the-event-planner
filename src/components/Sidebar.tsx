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
        "relative flex flex-col h-screen transition-all duration-300 ease-in-out bg-zinc-900",
        isCollapsed ? "w-[80px]" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-center">
            <img 
              src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
              alt="WarmKaroo Logo" 
              className={cn(
                "transition-all duration-300",
                isCollapsed ? "h-8" : "h-10"
              )}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center h-10 rounded-md transition-all duration-300 ease-in-out group hover:bg-zinc-800",
                    isCollapsed ? "justify-center px-2" : "px-3",
                    isActive ? "bg-zinc-800 text-white" : "text-zinc-400"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    "group-hover:text-white"
                  )} />
                  
                  {!isCollapsed && (
                    <span className={cn(
                      "ml-3 text-sm font-medium transition-colors duration-300",
                      "group-hover:text-white"
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
        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center w-10 h-10",
              "rounded-md transition-all duration-300",
              "hover:bg-zinc-800 text-zinc-400 hover:text-white"
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
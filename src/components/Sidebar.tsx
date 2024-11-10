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
        "relative flex flex-col h-screen",
        isCollapsed ? "w-[80px] bg-zinc-900" : "w-64 bg-white",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-center">
            <img 
              src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
              alt="WarmKaroo Logo" 
              className={cn(
                isCollapsed ? "h-8" : "h-10"
              )}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6">
          <nav className="px-3 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center h-10 rounded-md",
                    isCollapsed 
                      ? "justify-center w-10 mx-auto" 
                      : "px-4",
                    isCollapsed 
                      ? (isActive ? "text-white" : "text-zinc-400") 
                      : (isActive 
                          ? "text-zinc-900 bg-zinc-50 border border-zinc-200" 
                          : "text-zinc-700 hover:bg-zinc-50 hover:border hover:border-zinc-100")
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0",
                    isCollapsed && "mx-auto"
                  )} />
                  
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with toggle */}
        <div className="p-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg outline-none",
              isCollapsed 
                ? "text-zinc-400 hover:text-white mx-auto" 
                : "text-zinc-700 hover:bg-zinc-50"
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
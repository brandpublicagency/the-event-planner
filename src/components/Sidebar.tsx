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
        "relative flex flex-col h-screen transition-all duration-300",
        isCollapsed ? "bg-zinc-900 w-[80px]" : "bg-white w-64",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "p-4 border-b transition-colors duration-300",
          isCollapsed ? "border-zinc-800" : "border-zinc-200"
        )}>
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
                    "flex items-center transition-all duration-300 ease-in-out group",
                    isCollapsed ? "justify-center" : "h-10",
                    isCollapsed 
                      ? (isActive ? "text-white" : "text-zinc-400") 
                      : (isActive ? "text-zinc-900" : "text-zinc-600")
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors",
                    isCollapsed
                      ? (isActive ? "bg-zinc-800" : "hover:bg-zinc-800")
                      : (isActive ? "bg-zinc-100" : "hover:bg-zinc-100")
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">
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
          "p-4 border-t transition-colors duration-300",
          isCollapsed ? "border-zinc-800" : "border-zinc-200"
        )}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              isCollapsed 
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
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
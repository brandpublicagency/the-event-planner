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
      <div className="space-y-4 py-4 flex flex-col flex-grow">
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
                    src={isCollapsed 
                      ? "https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
                      : "https://www.brandpublic.agency/wp-content/uploads/2023/11/WK-Black-Icon.png"
                    }
                    alt="WarmKaroo Logo" 
                    className="h-8 transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
          <nav className="flex flex-col space-y-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center h-10 relative group",
                    isCollapsed ? "w-10 justify-center" : "w-full pl-4",
                    "transition-all duration-500 ease-in-out rounded-md",
                    "focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0",
                    isActive 
                      ? isCollapsed
                        ? "bg-zinc-200 text-zinc-900 shadow-sm"
                        : "bg-zinc-100 text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900",
                    !isCollapsed && "hover:bg-zinc-100",
                    isCollapsed && !isActive && "hover:bg-zinc-200"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isActive ? "text-zinc-900" : "text-zinc-600",
                    "group-hover:scale-110 group-hover:text-zinc-900"
                  )} />
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex items-center h-10 group w-full",
            isCollapsed ? "w-10 justify-center" : "pl-4",
            "transition-all duration-500 ease-in-out rounded-md",
            "focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0",
            isCollapsed
              ? "hover:bg-zinc-200 text-zinc-600"
              : "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
          )}
        >
          {isCollapsed ? (
            <>
              <ChevronRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-zinc-900" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Expand
              </div>
            </>
          ) : (
            <ChevronLeft className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-zinc-900" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
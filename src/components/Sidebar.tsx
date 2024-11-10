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
    <div className={cn("pb-12 relative flex flex-col h-full bg-zinc-900", className)}>
      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2">
          <div className="mb-8 flex items-center justify-center">
            <img 
              src={isCollapsed 
                ? "https://www.brandpublic.agency/wp-content/uploads/2024/11/WHITE-LOGO.png"
                : "https://www.brandpublic.agency/wp-content/uploads/2023/11/WK-Black-Icon.png"
              }
              alt="WarmKaroo Logo" 
              className="h-8"
            />
          </div>
          <nav className="flex flex-col space-y-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center h-10 w-10 relative rounded-md",
                    "transition-colors duration-200",
                    isActive 
                      ? "bg-white text-zinc-900"
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <span className="ml-3 text-white">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto px-3 py-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-md",
              "transition-colors duration-200",
              "text-white hover:bg-white/10"
            )}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
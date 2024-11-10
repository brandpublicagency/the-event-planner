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
    { icon: Home, path: "/" },
    { icon: Calendar, path: "/events" },
    { icon: CalendarPlus, path: "/events/new" },
    { icon: Calendar, path: "/calendar" },
    { icon: FileText, path: "/documents" },
  ];

  return (
    <div className={cn("pb-12 relative flex flex-col h-full", className)}>
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
                    "flex items-center justify-center h-10 w-10 relative group rounded-md",
                    "transition-colors duration-200",
                    isActive 
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50">
                    {navItems.find(nav => nav.path === item.path)?.path.split('/').filter(Boolean).join(' ') || 'Home'}
                  </div>
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
              "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
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
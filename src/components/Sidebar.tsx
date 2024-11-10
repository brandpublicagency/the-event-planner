import { cn } from "@/lib/utils";
import { Home, Calendar, FileText, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: CalendarDays, label: "Upcoming Events", path: "/events" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: FileText, label: "Planning Documents", path: "/documents" },
  ];

  return (
    <div className={cn("pb-12 relative flex flex-col h-full", className)}>
      <div className="space-y-6 py-4">
        <div className="px-3 py-2">
          <div className="mb-12 flex items-center justify-between">
            {isCollapsed ? (
              <img 
                src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKW.svg" 
                alt="WarmKaroo Logo" 
                className="h-12 w-12 mx-auto" // Increased from h-8 w-8
              />
            ) : (
              <div className="flex items-center gap-2">
                <img 
                  src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKB.svg" 
                  alt="WarmKaroo Logo" 
                  className="h-12" // Increased from h-8
                />
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                  Event Planner
                </h2>
              </div>
            )}
          </div>
          <div className="space-y-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center",
                    isCollapsed ? "justify-center" : "",
                    "h-[50px] gap-5"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-[50px] h-[50px] rounded-md transition-colors duration-200",
                    isCollapsed ? 
                      isActive ? "bg-white" : "text-white hover:bg-zinc-800" :
                      isActive ? "bg-zinc-100" : "text-zinc-600 hover:bg-zinc-100"
                  )}>
                    <Icon className={cn(
                      "h-6 w-6",
                      isCollapsed ? (
                        isActive ? "text-zinc-900" : "text-white"
                      ) : (
                        isActive ? "text-zinc-900" : "text-zinc-500"
                      )
                    )} />
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium text-zinc-600">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 w-full px-3">
        <Link 
          to="#"
          onClick={(e) => {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }}
          className="flex items-center"
        >
          <div className={cn(
            "flex items-center justify-center w-[50px] h-[50px] rounded-md transition-colors duration-200",
            isCollapsed ? 
              "text-white hover:bg-zinc-800" : 
              "text-zinc-600 hover:bg-zinc-100"
          )}>
            {isCollapsed ? (
              <ChevronRight className="h-6 w-6 text-white" />
            ) : (
              <ChevronLeft className="h-6 w-6 text-zinc-500" />
            )}
          </div>
          {!isCollapsed && (
            <span className="text-sm font-medium text-zinc-600 ml-5">
              Collapse
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
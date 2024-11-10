import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Calendar, FileText, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Tooltip } from "@/components/ui/tooltip";

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
    <div className={cn("pb-12 relative", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className={cn(
              "text-lg font-semibold tracking-tight transition-all duration-300",
              isCollapsed && "opacity-0"
            )}>
              Event Planner
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip
                  key={item.path}
                  delayDuration={0}
                  side="right"
                  content={isCollapsed ? item.label : null}
                >
                  <Link to={item.path}>
                    <Button
                      variant={location.pathname === item.path ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isCollapsed && "px-2"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                      <span className={cn(
                        "transition-all duration-300",
                        isCollapsed && "hidden"
                      )}>
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Calendar, FileText, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
      <div className="space-y-6 py-4">
        <div className="px-3 py-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className={cn(
              "text-lg font-semibold tracking-tight transition-all duration-300",
              isCollapsed ? "opacity-0 w-0 text-white" : "text-zinc-900"
            )}>
              Event Planner
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isCollapsed ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 
                <ChevronRight className={cn("h-4 w-4", isCollapsed ? "text-white" : "text-zinc-500")} /> : 
                <ChevronLeft className={cn("h-4 w-4", isCollapsed ? "text-white" : "text-zinc-500")} />
              }
            </Button>
          </div>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={item.path} className="block">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-x-3",
                          isCollapsed ? "px-2" : "px-3",
                          isCollapsed ? 
                            "text-white hover:bg-zinc-800" : 
                            "text-zinc-600 hover:bg-zinc-100",
                          location.pathname === item.path && (
                            isCollapsed ? 
                              "bg-zinc-800 text-white" : 
                              "bg-zinc-100 text-zinc-900"
                          )
                        )}
                      >
                        <Icon className={cn(
                          "h-4 w-4",
                          isCollapsed ? "text-white" : "text-zinc-500",
                          !isCollapsed && "mr-0.5"
                        )} />
                        <span className={cn(
                          "transition-all duration-300",
                          isCollapsed && "hidden"
                        )}>
                          {item.label}
                        </span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
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
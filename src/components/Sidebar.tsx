import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Calendar, FileText, CalendarDays, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

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
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={item.path} className="block">
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
        
        {/* Theme Toggle */}
        <div className="px-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={cn(
                  "w-full justify-center",
                  !isCollapsed && "justify-start"
                )}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                {!isCollapsed && <span className="ml-2">Toggle theme</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Toggle theme
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
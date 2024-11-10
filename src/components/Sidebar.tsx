import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Calendar, FileText, CalendarDays } from "lucide-react";
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
            {isCollapsed ? (
              <img 
                src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKW.svg" 
                alt="WarmKaroo Logo" 
                className="h-8 w-8 mx-auto"
              />
            ) : (
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                Event Planner
              </h2>
            )}
          </div>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={item.path} className="block">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full transition-all duration-300",
                          isCollapsed ? "justify-center p-2" : "justify-start px-3",
                          isCollapsed ? 
                            "text-white hover:bg-zinc-800" : 
                            "text-zinc-600 hover:bg-zinc-100",
                          isActive && (
                            isCollapsed ? 
                              "bg-zinc-800 text-white" : 
                              "bg-zinc-100 text-zinc-900"
                          )
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 transition-all",
                          isCollapsed ? "text-white" : "text-zinc-500",
                          isActive && !isCollapsed && "text-zinc-900"
                        )} />
                        {!isCollapsed && (
                          <span className="ml-3">{item.label}</span>
                        )}
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
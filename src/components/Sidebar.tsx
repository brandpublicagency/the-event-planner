import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Home, Calendar, FileText, CalendarDays } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Event Planner
          </h2>
          <div className="space-y-1">
            <Link to="/">
              <Button
                variant={location.pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/events">
              <Button
                variant={location.pathname === "/events" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Upcoming Events
              </Button>
            </Link>
            <Link to="/calendar">
              <Button
                variant={location.pathname === "/calendar" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </Link>
            <Link to="/documents">
              <Button
                variant={location.pathname === "/documents" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Planning Documents
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
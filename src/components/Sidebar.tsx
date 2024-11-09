import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Calendar, FileText, CalendarDays } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col border-r border-zinc-200 bg-white",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-zinc-200 px-4">
        <span className="text-lg font-semibold">Event Planner</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
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
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
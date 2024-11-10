import { cn } from "@/lib/utils";
import { Home, Calendar, FileText, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: FileText, label: "Planning Documents", path: "/documents" },
  ];

  return (
    <div className={cn("pb-12 relative flex flex-col h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-8 flex items-center justify-between">
            {isCollapsed ? (
              <img 
                src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKW.svg" 
                alt="WarmKaroo Logo" 
                className="h-8 w-8 mx-auto"
              />
            ) : (
              <div className="flex items-center gap-2">
                <img 
                  src="https://www.warmkaroo.com/wp-content/uploads/2023/10/WKB.svg" 
                  alt="WarmKaroo Logo" 
                  className="h-8"
                />
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                  Event Planner
                </h2>
              </div>
            )}
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center w-full",
                    isCollapsed ? "justify-center px-2" : "px-3",
                    "py-2 rounded-md transition-colors duration-200",
                    isActive 
                      ? "bg-zinc-100 text-zinc-900" 
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-auto px-3 py-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full",
            isCollapsed ? "justify-center px-2" : "px-3",
            "py-2 rounded-md transition-colors duration-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium">
              Logout
            </span>
          )}
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex items-center w-full mt-1",
            isCollapsed ? "justify-center px-2" : "px-3",
            "py-2 rounded-md transition-colors duration-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span className="ml-3 text-sm font-medium">
                Collapse
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
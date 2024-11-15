import { cn } from "@/lib/utils";
import { LayoutGrid, FileText, Bell, Wallet, ListTodo, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import SidebarProfile from "./sidebar/SidebarProfile";
import NavigationSection from "./sidebar/NavigationSection";
import ProfileBox from "./ProfileBox";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  const mainNavItems = [
    { icon: LayoutGrid, path: "/", label: "Dashboard" },
    { icon: FileText, path: "/events", label: "Events" },
    { icon: Wallet, path: "/calendar", label: "Calendar" },
    { icon: Bell, path: "/notifications", label: "Notification" },
  ];

  const otherNavItems = [
    { icon: ListTodo, path: "/tasks", label: "To-do list" },
    { icon: FileText, path: "/documents", label: "Documents" },
    { icon: Bell, path: "/agreements", label: "Agreements" },
  ];

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300",
        isCollapsed ? "w-[80px] bg-[#1A1F2C]" : "w-[280px] bg-white",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <SidebarProfile isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        
        <div className="flex-1 px-3 py-8">
          <div className="space-y-8">
            <NavigationSection
              title="MAIN"
              items={mainNavItems}
              isCollapsed={isCollapsed}
              currentPath={location.pathname}
            />
            <NavigationSection
              title="OTHER"
              items={otherNavItems}
              isCollapsed={isCollapsed}
              currentPath={location.pathname}
            />
            
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center h-10 rounded-lg transition-colors w-full",
                isCollapsed 
                  ? "justify-center w-10 mx-auto" 
                  : "px-3",
                "hover:bg-gray-50",
                isCollapsed 
                  ? "text-gray-400 hover:text-white" 
                  : "text-gray-600"
              )}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && (
                <span className="ml-3 text-sm">Sign out</span>
              )}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4">
            <ProfileBox />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
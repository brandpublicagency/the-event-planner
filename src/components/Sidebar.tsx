import { cn } from "@/lib/utils";
import { LayoutGrid, FileText, Bell, Wallet, ListTodo, Archive } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import SidebarProfile from "./sidebar/SidebarProfile";
import SidebarNavigation from "./sidebar/SidebarNavigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { toast } = useToast();

  const { data: taskCount = 0 } = useQuery({
    queryKey: ['taskCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completed', false);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const mainNavItems = [
    { icon: LayoutGrid, path: "/", label: "Dashboard" },
    { icon: FileText, path: "/events", label: "Events" },
    { icon: Archive, path: "/passed-events", label: "Passed Events" },
    { icon: Wallet, path: "/calendar", label: "Calendar" },
    { icon: Bell, path: "/notifications", label: "Notification" },
  ];

  const otherNavItems = [
    { 
      icon: ListTodo, 
      path: "/tasks", 
      label: "To-do list",
      badge: taskCount > 0 ? taskCount : undefined
    },
    { icon: FileText, path: "/documents", label: "Documents" },
    { icon: Bell, path: "/agreements", label: "Agreements" },
  ];

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen transition-all duration-500 ease-in-out will-change-[width]",
        isCollapsed ? "w-[80px] bg-[#1A1F2C]" : "w-[280px] bg-white",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <SidebarProfile isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        
        <div className="flex-1 px-4 py-8 overflow-hidden">
          <div className="space-y-8">
            <SidebarNavigation 
              isCollapsed={isCollapsed} 
              items={mainNavItems} 
              sectionTitle="MAIN" 
            />
            <SidebarNavigation 
              isCollapsed={isCollapsed} 
              items={otherNavItems} 
              sectionTitle="OTHER" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
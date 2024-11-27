import { cn } from "@/lib/utils";
import { LayoutGrid, FileText, Archive, Wallet, ListTodo } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import SidebarProfile from "./sidebar/SidebarProfile";
import SidebarNavigation from "./sidebar/SidebarNavigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const { toast } = useToast();
  const location = useLocation();

  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
        return 'bg-gradient-to-b from-blue-50/80 to-indigo-50/80';
      case '/events':
        return 'bg-gradient-to-b from-emerald-50/80 to-teal-50/80';
      case '/passed-events':
        return 'bg-gradient-to-b from-violet-50/80 to-purple-50/80';
      case '/calendar':
        return 'bg-gradient-to-b from-rose-50/80 to-pink-50/80';
      case '/tasks':
        return 'bg-gradient-to-b from-amber-50/80 to-yellow-50/80';
      case '/documents':
        return 'bg-gradient-to-b from-cyan-50/80 to-sky-50/80';
      default:
        return 'bg-gradient-to-b from-slate-50/80 to-gray-50/80';
    }
  };

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
    { 
      icon: ListTodo, 
      path: "/tasks", 
      label: "To-do list",
      badge: taskCount > 0 ? taskCount : undefined
    },
    { icon: FileText, path: "/documents", label: "Documents" },
  ];

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen transition-all duration-500 ease-in-out will-change-[width]",
        isCollapsed ? "w-[80px]" : "w-[280px]",
        !isCollapsed && getGradientByPath(),
        isCollapsed && "bg-[#1A1F2C]",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
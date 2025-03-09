import { cn } from "@/lib/utils";
import { LayoutGrid, FileText, Archive, Wallet, ListTodo, Users, Plus, FilePlus, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarProfile from "./sidebar/SidebarProfile";
import SidebarNavigation from "./sidebar/SidebarNavigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({
  className,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) => {
  const {
    toast
  } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
        return 'bg-gradient-to-b from-blue-50/50 via-indigo-50/50 to-blue-100/50';
      case '/events':
        return 'bg-gradient-to-b from-emerald-50/50 via-green-50/50 to-teal-100/50';
      case '/passed-events':
        return 'bg-gradient-to-b from-violet-50/50 via-purple-50/50 to-violet-100/50';
      case '/calendar':
        return 'bg-gradient-to-b from-rose-50/50 via-pink-50/50 to-rose-100/50';
      case '/tasks':
        return 'bg-gradient-to-b from-amber-50/50 via-yellow-50/50 to-amber-100/50';
      case '/contacts':
        return 'bg-gradient-to-b from-orange-50/50 via-orange-50/50 to-orange-100/50';
      case '/documents':
        return 'bg-gradient-to-b from-cyan-50/50 via-sky-50/50 to-cyan-100/50';
      default:
        return 'bg-gradient-to-b from-slate-50/50 via-gray-50/50 to-slate-100/50';
    }
  };

  const {
    data: taskCount = 0
  } = useQuery({
    queryKey: ['taskCount'],
    queryFn: async () => {
      const {
        count,
        error
      } = await supabase.from('tasks').select('*', {
        count: 'exact',
        head: true
      }).eq('completed', false);
      if (error) throw error;
      return count || 0;
    }
  });

  const mainNavItems = [{
    icon: LayoutGrid,
    path: "/",
    label: "Dashboard"
  }, {
    icon: FileText,
    path: "/events",
    label: "Events"
  }, {
    icon: Archive,
    path: "/passed-events",
    label: "Passed Events"
  }, {
    icon: Wallet,
    path: "/calendar",
    label: "Calendar"
  }, {
    icon: ListTodo,
    path: "/tasks",
    label: "To-do list",
    badge: taskCount > 0 ? taskCount : undefined
  }, {
    icon: Users,
    path: "/contacts",
    label: "Contacts"
  }, {
    icon: FileText,
    path: "/documents",
    label: "Documents"
  }];

  const handleAddDocument = () => {
    if (location.pathname === '/documents') {
      if (location.search.includes('newDocument=true')) {
        console.log('Already on documents page with newDocument=true parameter');
        return;
      }
      navigate('/documents?newDocument=true', { replace: true });
    } else {
      navigate('/documents?newDocument=true');
    }
  };

  return (
    <div className={cn(
      "relative h-full transition-all duration-500 ease-in-out will-change-[width]", 
      isCollapsed ? "w-[70px]" : "w-64", 
      !isCollapsed && getGradientByPath(), 
      isCollapsed && "bg-[#1A1F2C]", 
      className
    )}>
      {isCollapsed ? (
        <div className="flex flex-col h-full">
          <div className="py-4">
            <SidebarProfile isCollapsed={isCollapsed} />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <SidebarNavigation isCollapsed={isCollapsed} items={mainNavItems} />
          </div>
          
          <div className="py-4 flex flex-col items-center gap-4">
            <button 
              onClick={() => navigate('/events/new')} 
              className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md"
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
            </button>
            
            <button 
              onClick={() => navigate('/tasks?newTask=true')} 
              className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md"
            >
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
            </button>
            
            <button 
              onClick={handleAddDocument} 
              className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md"
            >
              <FilePlus className="h-4 w-4 flex-shrink-0" />
            </button>
            
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md mt-4"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <SidebarProfile isCollapsed={isCollapsed} />
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-[5px] mx-[5px] py-[10px]">
            <div className="space-y-6 my-2 mx-[5px] px-0">
              <SidebarNavigation isCollapsed={isCollapsed} items={mainNavItems} />
              
              <div className="px-3">
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="flex items-center w-full text-gray-400 hover:text-gray-700 text-xs">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="font-normal px-[5px] text-gray-400">COLLAPSE MENU</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-auto px-3 pb-3">
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => navigate('/events/new')} 
                className="flex items-center text-gray-600 hover:text-gray-900 text-sm h-9 px-2 rounded-md gap-2"
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span>ADD EVENT</span>
              </button>
              
              <button 
                onClick={() => navigate('/tasks?newTask=true')} 
                className="flex items-center text-gray-600 hover:text-gray-900 text-sm h-9 px-2 rounded-md gap-2"
              >
                <CheckSquare className="h-4 w-4 flex-shrink-0" />
                <span>ADD TASK</span>
              </button>
              
              <button 
                onClick={handleAddDocument} 
                className="flex items-center text-gray-600 hover:text-gray-900 text-sm h-9 px-2 rounded-md gap-2"
              >
                <FilePlus className="h-4 w-4 flex-shrink-0" />
                <span>ADD DOCUMENT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

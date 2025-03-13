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

  // Enhanced gradient definitions with more depth and visual interest
  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
        // Dashboard - Beautiful blue gradient with subtle depth
        return 'bg-gradient-to-br from-blue-50 via-indigo-50/80 to-sky-100 backdrop-blur-sm border-r border-blue-100/50';
      
      case '/events':
        // Events - Rich emerald gradient with depth
        return 'bg-gradient-to-br from-emerald-50 via-green-50/80 to-teal-100 backdrop-blur-sm border-r border-emerald-100/50';
      
      case '/passed-events':
        // Passed Events - Elegant violet gradient
        return 'bg-gradient-to-br from-violet-50 via-purple-50/80 to-fuchsia-100 backdrop-blur-sm border-r border-violet-100/50';
      
      case '/calendar':
        // Calendar - Sophisticated rose gradient
        return 'bg-gradient-to-br from-rose-50 via-pink-50/80 to-red-100 backdrop-blur-sm border-r border-rose-100/50';
      
      case '/tasks':
        // Tasks - Warm amber gradient
        return 'bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-100 backdrop-blur-sm border-r border-amber-100/50';
      
      case '/contacts':
        // Contacts - Vibrant orange gradient
        return 'bg-gradient-to-br from-orange-50 via-orange-50/80 to-amber-100 backdrop-blur-sm border-r border-orange-100/50';
      
      case '/documents':
        // Documents - Cool cyan gradient
        return 'bg-gradient-to-br from-cyan-50 via-sky-50/80 to-blue-100 backdrop-blur-sm border-r border-cyan-100/50';
      
      default:
        // Default - Neutral slate gradient
        return 'bg-gradient-to-br from-slate-50 via-gray-50/80 to-slate-100 backdrop-blur-sm border-r border-slate-100/50';
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
      navigate('/documents?newDocument=true', {
        replace: true
      });
    } else {
      navigate('/documents?newDocument=true');
    }
  };

  return (
    <div className={cn(
      "relative h-full transition-all duration-300 ease-in-out will-change-[width]", 
      isCollapsed ? "w-[70px] bg-[#1A1F2C]" : "w-64", 
      !isCollapsed && getGradientByPath(),
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
            <button onClick={() => navigate('/events/new')} className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md transition-colors duration-200">
              <Plus className="h-4 w-4 flex-shrink-0" />
            </button>
            
            <button onClick={() => navigate('/tasks?newTask=true')} className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md transition-colors duration-200">
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
            </button>
            
            <button onClick={handleAddDocument} className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md transition-colors duration-200">
              <FilePlus className="h-4 w-4 flex-shrink-0" />
            </button>
            
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="flex justify-center items-center text-gray-400 hover:text-white text-sm h-9 w-9 rounded-md mt-4 transition-colors duration-200">
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
            </div>
          </div>
          
          <div className="mt-auto px-3 pb-3">
            <div className="flex flex-col gap-2.5">
              <button onClick={() => navigate('/events/new')} className="flex items-center text-gray-600 hover:text-gray-900 text-sm h-9 px-2 rounded-md gap-2 transition-colors duration-200">
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span>ADD EVENT</span>
              </button>
              
              <button onClick={() => navigate('/tasks?newTask=true')} className="flex items-center text-gray-600 hover:text-gray-900 text-sm h-9 px-2 rounded-md gap-2 transition-colors duration-200">
                <CheckSquare className="h-4 w-4 flex-shrink-0" />
                <span>ADD TASK</span>
              </button>
              
              <button onClick={handleAddDocument} className="flex items-center text-gray-600 hover:text-gray-900 text-sm h-9 px-2 rounded-md gap-2 transition-colors duration-200">
                <FilePlus className="h-4 w-4 flex-shrink-0" />
                <span>ADD DOCUMENT</span>
              </button>
              
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="flex items-center text-sm h-9 px-2 rounded-md gap-2 mt-2 transition-colors duration-200 text-zinc-400">
                <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-xs">COLLAPSE MENU</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
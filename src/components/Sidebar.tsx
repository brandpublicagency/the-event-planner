
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  FileText, 
  Archive, 
  Wallet, 
  ListTodo, 
  Users, 
  Plus, 
  FilePlus, 
  CheckSquare, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Users as UsersIcon,
  Building
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarProfile from "./sidebar/SidebarProfile";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import { SidebarToasts } from "./sidebar/SidebarToasts";
import { motion } from "framer-motion";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({
  className,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const getGradientByPath = () => {
    switch (location.pathname) {
      case '/':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50/80 to-sky-100 backdrop-blur-sm border-r border-blue-100/50';
      case '/events':
        return 'bg-gradient-to-br from-emerald-50 via-green-50/80 to-teal-100 backdrop-blur-sm border-r border-emerald-100/50';
      case '/passed-events':
        return 'bg-gradient-to-br from-violet-50 via-purple-50/80 to-fuchsia-100 backdrop-blur-sm border-r border-violet-100/50';
      case '/calendar':
        return 'bg-gradient-to-br from-rose-50 via-pink-50/80 to-red-100 backdrop-blur-sm border-r border-rose-100/50';
      case '/tasks':
        return 'bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-100 backdrop-blur-sm border-r border-amber-100/50';
      case '/contacts':
        return 'bg-gradient-to-br from-orange-50 via-orange-50/80 to-amber-100 backdrop-blur-sm border-r border-orange-100/50';
      case '/documents':
        return 'bg-gradient-to-br from-cyan-50 via-sky-50/80 to-blue-100 backdrop-blur-sm border-r border-cyan-100/50';
      case '/schedule/meeting':
      case '/schedule/site-visit':
        return 'bg-gradient-to-br from-purple-50 via-indigo-50/80 to-violet-100 backdrop-blur-sm border-r border-purple-100/50';
      default:
        return 'bg-gradient-to-br from-slate-50 via-gray-50/80 to-slate-100 backdrop-blur-sm border-r border-slate-100/50';
    }
  };

  const { data: taskCount = 0 } = useQuery({
    queryKey: ['taskCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', {
          count: 'exact',
          head: true
        })
        .eq('completed', false);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const mainNavItems = [
    {
      icon: LayoutGrid,
      path: "/",
      label: "Dashboard"
    }, 
    {
      icon: FileText,
      path: "/events",
      label: "Upcoming Events"
    }, 
    {
      icon: Wallet,
      path: "/calendar",
      label: "Calendar"
    }, 
    {
      icon: ListTodo,
      path: "/tasks",
      label: "To-do list",
      badge: taskCount > 0 ? taskCount : undefined
    },
    {
      icon: Building,
      path: "/schedule/site-visit",
      label: "Schedule Site Visit"
    },
    {
      icon: UsersIcon,
      path: "/schedule/meeting",
      label: "Schedule Meeting"
    },
    {
      icon: FileText,
      path: "/documents",
      label: "Documents"
    },
    {
      icon: Users,
      path: "/contacts",
      label: "Contacts"
    },
    {
      icon: Archive,
      path: "/passed-events",
      label: "Past Events"
    }
  ];
  
  // This section is no longer needed as we've incorporated these items into the main navigation
  // const scheduleNavItems = [
  //   {
  //     icon: UsersIcon,
  //     path: "/schedule/meeting",
  //     label: "Meeting"
  //   },
  //   {
  //     icon: Building,
  //     path: "/schedule/site-visit",
  //     label: "Site Visit"
  //   }
  // ];

  const handleAddDocument = () => {
    if (location.pathname === '/documents') {
      if (location.search.includes('newDocument=true')) {
        return;
      }
      navigate('/documents?newDocument=true', {
        replace: true
      });
    } else {
      navigate('/documents?newDocument=true');
    }
  };

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 70 }
  };

  return (
    <motion.div 
      className={cn(
        "relative h-full transition-all duration-300 ease-in-out overflow-hidden",
        getGradientByPath(),
        className
      )}
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      <div className="flex flex-col h-full">
        <SidebarProfile isCollapsed={isCollapsed} />
        
        <div className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden py-4",
          isCollapsed ? "px-2" : "px-3"
        )}>
          <SidebarNavigation 
            isCollapsed={isCollapsed} 
            items={mainNavItems} 
          />
        </div>
        
        <SidebarToasts isCollapsed={isCollapsed} />
        
        <div className={cn(
          "border-t border-gray-200/50 backdrop-blur-sm bg-white/20 pt-3 pb-4",
          isCollapsed ? "px-2" : "px-3"
        )}>
          <div className={cn(
            "flex",
            isCollapsed ? "flex-col items-center gap-3" : "flex-col gap-1"
          )}>
            {isCollapsed ? (
              <>
                <button 
                  onClick={() => navigate('/events/new')} 
                  className="group flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-white/50 h-10 w-10 rounded-full transition-all duration-200"
                  title="Add Event"
                >
                  <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
                </button>
                
                <button 
                  onClick={() => navigate('/tasks?newTask=true')} 
                  className="group flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-white/50 h-10 w-10 rounded-full transition-all duration-200"
                  title="Add Task"
                >
                  <CheckSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
                </button>
                
                <button 
                  onClick={handleAddDocument} 
                  className="group flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-white/50 h-10 w-10 rounded-full transition-all duration-200"
                  title="Add Document"
                >
                  <FilePlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                </button>
                
                <div className="my-2 w-8 border-t border-gray-200/50"></div>
                
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)} 
                  className="group flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-white/50 h-10 w-10 rounded-full transition-all duration-200"
                  title="Expand Sidebar"
                >
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/events/new')} 
                  className="group flex items-center text-gray-700 hover:text-gray-900 h-10 px-3 rounded-lg gap-2.5 hover:bg-white/50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">Add Event</span>
                </button>
                
                <button 
                  onClick={() => navigate('/tasks?newTask=true')} 
                  className="group flex items-center text-gray-700 hover:text-gray-900 h-10 px-3 rounded-lg gap-2.5 hover:bg-white/50 transition-all duration-200"
                >
                  <CheckSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">Add Task</span>
                </button>
                
                <button 
                  onClick={handleAddDocument} 
                  className="group flex items-center text-gray-700 hover:text-gray-900 h-10 px-3 rounded-lg gap-2.5 hover:bg-white/50 transition-all duration-200"
                >
                  <FilePlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">Add Document</span>
                </button>
                
                <div className="my-2 border-t border-gray-200/50"></div>
                
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)} 
                  className="group flex items-center text-gray-700 hover:text-gray-900 h-10 px-3 rounded-lg gap-2.5 hover:bg-white/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <span className="text-sm font-medium">Collapse Sidebar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

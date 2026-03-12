
import { cn } from "@/lib/utils";
import { Plus, CheckSquare, FilePlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarActionsProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarActions = ({ isCollapsed, setIsCollapsed }: SidebarActionsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const hoverBg = "hover:bg-white/15 dark:hover:bg-white/10";

  return (
    <div className={cn(
      "border-t border-sidebar-border pt-2 pb-3",
      isCollapsed ? "px-2" : "px-3"
    )}>
      <div className={cn(
        "flex",
        isCollapsed ? "flex-col items-center gap-2" : "flex-col gap-1"
      )}>
        {isCollapsed ? (
          <>
            <button 
              onClick={() => navigate('/events/new')} 
              className={cn("group flex justify-center items-center text-foreground/60 hover:text-foreground h-8 w-8 rounded-full transition-all duration-200", hoverBg)}
              title="Add Event"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
            
            <button 
              onClick={() => navigate('/tasks?newTask=true')} 
              className={cn("group flex justify-center items-center text-foreground/60 hover:text-foreground h-8 w-8 rounded-full transition-all duration-200", hoverBg)}
              title="Add Task"
            >
              <CheckSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
            
            <button 
              onClick={handleAddDocument} 
              className={cn("group flex justify-center items-center text-foreground/60 hover:text-foreground h-8 w-8 rounded-full transition-all duration-200", hoverBg)}
              title="Add Document"
            >
              <FilePlus className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
            
            <div className="my-1.5 w-6 border-t border-sidebar-border"></div>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={cn("group flex justify-center items-center text-foreground/60 hover:text-foreground h-8 w-8 rounded-full transition-all duration-200", hoverBg)}
              title="Expand Sidebar"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate('/events/new')} 
              className={cn("group flex items-center text-foreground/70 hover:text-foreground h-8 px-3 rounded-lg gap-2 transition-all duration-200", hoverBg)}
            >
              <Plus className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span className="text-xs font-medium">Add Event</span>
            </button>
            
            <button 
              onClick={() => navigate('/tasks?newTask=true')} 
              className={cn("group flex items-center text-foreground/70 hover:text-foreground h-8 px-3 rounded-lg gap-2 transition-all duration-200", hoverBg)}
            >
              <CheckSquare className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span className="text-xs font-medium">Add Task</span>
            </button>
            
            <button 
              onClick={handleAddDocument} 
              className={cn("group flex items-center text-foreground/70 hover:text-foreground h-8 px-3 rounded-lg gap-2 transition-all duration-200", hoverBg)}
            >
              <FilePlus className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <span className="text-xs font-medium">Add Document</span>
            </button>
            
            <div className="my-1.5 border-t border-sidebar-border"></div>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className={cn("group flex items-center text-foreground/70 hover:text-foreground h-8 px-3 rounded-lg gap-2 transition-all duration-200", hoverBg)}
            >
              <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="text-xs font-medium">Collapse Sidebar</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarActions;

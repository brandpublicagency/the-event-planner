
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  item: {
    icon: React.ElementType;
    path: string;
    label: string;
    badge?: number;
  };
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarNavItem = ({ item, isCollapsed, isActive }: NavItemProps) => {
  const Icon = item.icon;
  
  return (
    <Link 
      to={item.path} 
      className={cn(
        "group flex items-center h-9 rounded-lg relative outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400 transition-all duration-200", 
        isCollapsed ? "justify-center w-9 mx-auto" : "px-3", 
        isActive ? "bg-background/60 text-foreground shadow-sm" : "text-foreground/70 hover:bg-background/40 hover:text-foreground"
      )}
    >
      <div className={cn("flex items-center", isCollapsed ? "justify-center" : "w-full")}>
        <div className={cn(
          "relative", 
          isActive && !isCollapsed && "after:absolute after:left-0 after:top-0 after:h-full after:w-[3px] after:rounded-full after:bg-gradient-to-b after:from-primary after:to-primary/70 after:-ml-3"
        )}>
          <Icon className={cn(
            "flex-shrink-0 transition-transform", 
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/70", 
            isCollapsed ? "h-4 w-4 group-hover:scale-110" : "h-4 w-4"
          )} />
        </div>
        
        {!isCollapsed && (
          <motion.span 
            className={cn(
              "ml-3 text-xs font-medium whitespace-nowrap", 
              isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
            )} 
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {item.label}
          </motion.span>
        )}
        
        {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-auto bg-primary/10 text-primary hover:bg-primary/15 px-1.5 py-0 text-[10px]"
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Badge>
        )}
        
        {isCollapsed && item.badge !== undefined && item.badge > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-1 -right-1 text-[8px] px-1 min-w-[14px] h-[14px] flex items-center justify-center bg-primary text-white"
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Badge>
        )}
        
        {!isCollapsed && isActive && <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground" />}
      </div>
      
      {/* Hover indicator for collapsed state */}
      {isCollapsed && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="h-7 w-1 rounded-l-full bg-gray-300/50"></div>
        </div>
      )}
    </Link>
  );
};

export default SidebarNavItem;

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  icon: React.ElementType;
  path: string;
  label: string;
  badge?: number;
}

interface SidebarNavigationProps {
  isCollapsed: boolean;
  items: NavItem[];
  sectionTitle?: string;
}

const SidebarNavigation = ({
  isCollapsed,
  items,
  sectionTitle
}: SidebarNavigationProps) => {
  const location = useLocation();
  
  return (
    <div className={cn(
      "overflow-hidden",
      isCollapsed && "w-full flex flex-col items-center"
    )}>
      {sectionTitle && (
        <div className={cn(
          "text-xs font-medium mb-4",
          isCollapsed ? "text-center w-full" : "",
          "text-gray-500 uppercase tracking-wider px-3"
        )}>
          {sectionTitle}
        </div>
      )}
      <nav className="space-y-3 pt-4">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "group flex items-center h-10 rounded-lg relative outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400 transition-all duration-200",
                isCollapsed ? "justify-center w-10 mx-auto" : "px-3",
                isActive 
                  ? "bg-white/60 text-gray-900 shadow-sm" 
                  : "text-gray-700 hover:bg-white/40 hover:text-gray-900"
              )}
            >
              <div className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "w-full"
              )}>
                <div className={cn(
                  "relative",
                  isActive && !isCollapsed && "after:absolute after:left-0 after:top-0 after:h-full after:w-[3px] after:rounded-full after:bg-gradient-to-b after:from-primary after:to-primary/70 after:-ml-3"
                )}>
                  <Icon className={cn(
                    "flex-shrink-0 transition-transform",
                    isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700",
                    isCollapsed ? "h-5 w-5 group-hover:scale-110" : "h-[18px] w-[18px]"
                  )} />
                </div>
                
                {!isCollapsed && (
                  <motion.span 
                    className={cn(
                      "ml-3 text-sm font-medium whitespace-nowrap",
                      isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                    )}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
                
                {!isCollapsed && item.badge !== undefined && (
                  <Badge 
                    variant="secondary"
                    className="ml-auto bg-primary/10 text-primary hover:bg-primary/15 px-2 py-0"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
                
                {isCollapsed && item.badge !== undefined && (
                  <Badge 
                    variant="secondary"
                    className="absolute -top-1 -right-1 text-[10px] px-1 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
                
                {!isCollapsed && isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-gray-500" />
                )}
              </div>
              
              {/* Hover indicator for collapsed state */}
              {isCollapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="h-8 w-1 rounded-l-full bg-gray-300/50"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
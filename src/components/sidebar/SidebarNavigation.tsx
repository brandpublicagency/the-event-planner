
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  path: string;
  label: string;
  badge?: number;
}

interface SidebarNavigationProps {
  isCollapsed: boolean;
  items: NavItem[];
  sectionTitle?: string; // Made optional
}

const SidebarNavigation = ({
  isCollapsed,
  items,
  sectionTitle
}: SidebarNavigationProps) => {
  const location = useLocation();
  
  return (
    <div className={cn("px-0", isCollapsed && "w-full")}>
      {sectionTitle && (
        <div className={cn("text-xs font-medium mb-4", isCollapsed ? "text-gray-600 text-center" : "text-gray-400")}>
          {sectionTitle}
        </div>
      )}
      <nav className={cn("space-y-6", isCollapsed && "flex flex-col items-center")}>
        {items.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex items-center h-10 rounded-lg relative",
                isCollapsed ? "justify-center w-10 transition-colors duration-200" : "px-3",
                isActive 
                  ? isCollapsed ? "text-gray-900" : "text-gray-900" 
                  : isCollapsed ? "text-gray-600 hover:text-gray-900" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "transition-colors duration-200")} />
              {!isCollapsed && <div className="flex flex-1 items-center">
                <span className="ml-3 text-sm">{item.label}</span>
              </div>}
              {!isCollapsed && isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNavigation;

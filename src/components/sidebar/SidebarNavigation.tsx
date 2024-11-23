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
  sectionTitle: string;
}

const SidebarNavigation = ({ isCollapsed, items, sectionTitle }: SidebarNavigationProps) => {
  const location = useLocation();

  return (
    <div>
      <div className={cn(
        "text-xs font-medium mb-4",
        isCollapsed ? "text-gray-600 text-center" : "text-gray-400"
      )}>
        {sectionTitle}
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center h-10 rounded-lg relative",
                isCollapsed 
                  ? "justify-center w-10 mx-auto transition-colors duration-200" 
                  : "px-3",
                isActive
                  ? (isCollapsed ? "bg-[#2A2F3C] text-white" : "bg-gray-100")
                  : isCollapsed 
                    ? "text-gray-400 hover:bg-[#2A2F3C] hover:text-white" 
                    : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isCollapsed && "transition-colors duration-200"
              )} />
              {!isCollapsed && (
                <div className="flex flex-1 items-center">
                  <span className="ml-3 text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              {!isCollapsed && isActive && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
              {isCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  icon: LucideIcon;
  path: string;
  label: string;
}

interface NavigationSectionProps {
  title: string;
  items: NavigationItem[];
  isCollapsed: boolean;
  currentPath: string;
}

const NavigationSection = ({ title, items, isCollapsed, currentPath }: NavigationSectionProps) => {
  return (
    <div>
      <div className={cn(
        "text-xs font-medium mb-4",
        isCollapsed ? "text-gray-600 text-center" : "text-gray-400 px-3"
      )}>
        {title}
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center h-10 rounded-lg transition-colors",
                isCollapsed 
                  ? "justify-center w-10 mx-auto" 
                  : "px-3",
                isActive
                  ? (isCollapsed ? "bg-[#2A2F3C]" : "bg-gray-100")
                  : "hover:bg-gray-50",
                isCollapsed 
                  ? "text-gray-400 hover:text-white" 
                  : "text-gray-600"
              )}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && (
                <span className="ml-3 text-sm">{item.label}</span>
              )}
              {!isCollapsed && isActive && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default NavigationSection;
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
const SidebarNavigation = ({
  isCollapsed,
  items,
  sectionTitle
}: SidebarNavigationProps) => {
  const location = useLocation();
  return <div className="px-0">
      <div className={cn("text-xs font-medium mb-4", isCollapsed ? "text-gray-600 text-center" : "text-gray-400")}>
        {sectionTitle}
      </div>
      <nav className="space-y-2">
        {items.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return <Link key={item.path} to={item.path} className={cn("flex items-center h-10 rounded-lg relative", isCollapsed ? "justify-center w-10 mx-auto transition-colors duration-200" : "px-3", isActive ? isCollapsed ? "text-white" : "text-gray-900" : isCollapsed ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-900")}>
              <Icon className={cn("h-5 w-5", isCollapsed && "transition-colors duration-200")} />
              {!isCollapsed && <div className="flex flex-1 items-center">
                  <span className="ml-3 text-sm">{item.label}</span>
                </div>}
              {!isCollapsed && isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>;
      })}
      </nav>
    </div>;
};
export default SidebarNavigation;
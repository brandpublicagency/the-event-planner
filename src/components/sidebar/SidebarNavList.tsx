
import { useLocation } from "react-router-dom";
import SidebarNavItem from "./SidebarNavItem";

interface NavItem {
  icon: React.ElementType;
  path: string;
  label: string;
  badge?: number;
}

interface SidebarNavListProps {
  items: NavItem[];
  isCollapsed: boolean;
}

const SidebarNavList = ({ items, isCollapsed }: SidebarNavListProps) => {
  const location = useLocation();
  
  return (
    <div className="space-y-2">
      {items.map(item => {
        const isPassedTab = location.search.includes("tab=passed");
        const isActive = item.path.includes("?")
          ? `${location.pathname}${location.search}` === item.path
          : location.pathname === item.path && !(item.path === "/events" && isPassedTab);
        
        return (
          <SidebarNavItem 
            key={item.path}
            item={item}
            isCollapsed={isCollapsed}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
};

export default SidebarNavList;


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
        const isActive = location.pathname === item.path;
        
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

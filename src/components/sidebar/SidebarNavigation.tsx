
import { cn } from "@/lib/utils";
import SidebarNavSectionTitle from "./SidebarNavSectionTitle";
import SidebarNavList from "./SidebarNavList";

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
  return (
    <div className={cn("overflow-hidden", isCollapsed && "w-full flex flex-col items-center")}>
      <SidebarNavSectionTitle title={sectionTitle || ""} isCollapsed={isCollapsed} />
      
      <nav className="my-2 py-0">
        <SidebarNavList items={items} isCollapsed={isCollapsed} />
      </nav>
    </div>
  );
};

export default SidebarNavigation;

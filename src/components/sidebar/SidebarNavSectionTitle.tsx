
import { cn } from "@/lib/utils";

interface SidebarNavSectionTitleProps {
  title: string;
  isCollapsed: boolean;
}

const SidebarNavSectionTitle = ({ title, isCollapsed }: SidebarNavSectionTitleProps) => {
  if (!title) return null;
  
  return (
    <div className={cn(
      "text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mt-6 mb-2", 
      isCollapsed ? "text-center w-full" : ""
    )}>
      {title}
    </div>
  );
};

export default SidebarNavSectionTitle;

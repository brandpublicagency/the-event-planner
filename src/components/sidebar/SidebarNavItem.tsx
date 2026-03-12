import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  item: {
    icon: React.ElementType;
    x;
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
        "group flex items-center h-9 rounded-lg relative outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sidebar-active/50 transition-all duration-200",
        isCollapsed ? "justify-center w-9 mx-auto" : "px-3",
        isActive
          ? "bg-sidebar-active text-sidebar-active-fg shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground",
      )}
    >
      <div className={cn("flex items-center", isCollapsed ? "justify-center" : "w-full")}>
        <Icon
          className={cn(
            "flex-shrink-0 transition-transform",
            isActive ? "text-sidebar-active-fg" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80",
            isCollapsed ? "h-4 w-4 group-hover:scale-110" : "h-4 w-4",
          )}
        />

        {!isCollapsed && (
          <motion.span
            className={cn(
              "ml-3 text-xs font-medium whitespace-nowrap",
              isActive ? "text-sidebar-active-fg" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
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
            className={cn(
              "ml-auto px-1.5 py-0 text-[10px]",
              isActive
                ? "bg-white/20 text-sidebar-active-fg hover:bg-white/25"
                : "bg-sidebar-active/10 text-sidebar-foreground hover:bg-sidebar-active/15",
            )}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Badge>
        )}

        {isCollapsed && item.badge !== undefined && item.badge > 0 && (
          <Badge
            variant="secondary"
            className="absolute -top-1 -right-1 text-[8px] px-1 min-w-[14px] h-[14px] flex items-center justify-center bg-sidebar-active text-sidebar-active-fg"
          >
            {item.badge > 99 ? "99+" : item.badge}
          </Badge>
        )}
      </div>

      {/* Hover indicator for collapsed state */}
      {isCollapsed && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="h-7 w-1 rounded-l-full bg-sidebar-active/30"></div>
        </div>
      )}
    </Link>
  );
};

export default SidebarNavItem;

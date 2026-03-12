import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import SidebarProfile from "./sidebar/SidebarProfile";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarActions from "./sidebar/SidebarActions";
import { useTaskCount } from "@/hooks/useTaskCount";
import { getSidebarNavItems } from "./sidebar/sidebarNavItems";
import { useSidebarGradient } from "@/hooks/useSidebarGradient";
import { useLocation } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const taskCount = useTaskCount();
  const { getGradientByPath } = useSidebarGradient();
  const location = useLocation();

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 70 },
  };

  const mainNavItems = getSidebarNavItems(taskCount);
  const gradient = getGradientByPath();

  return (
    <motion.div
      className={cn("relative h-full overflow-hidden", className)}
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Animated gradient background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={location.pathname}
          className={cn("absolute inset-0", gradient)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] ring-1 ring-inset ring-white/15 pointer-events-none" />

      <div className="flex flex-col h-full relative z-10">
        <SidebarProfile isCollapsed={isCollapsed} />

        <div className={cn("flex-1 overflow-y-auto overflow-x-hidden py-4", isCollapsed ? "px-2" : "px-3")}>
          <SidebarNavigation isCollapsed={isCollapsed} items={mainNavItems} />
        </div>

        <SidebarActions isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
    </motion.div>
  );
};

export default Sidebar;

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SidebarProfile from "./sidebar/SidebarProfile";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarActions from "./sidebar/SidebarActions";
import { useTaskCount } from "@/hooks/useTaskCount";
import { getSidebarNavItems } from "./sidebar/sidebarNavItems";
import { useSidebarGradient } from "@/hooks/useSidebarGradient";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const taskCount = useTaskCount();
  const { getGradientByPath } = useSidebarGradient();

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 70 },
  };

  const mainNavItems = getSidebarNavItems(taskCount);

  return (
    <motion.div
      className={cn("relative h-full overflow-hidden", getGradientByPath(), className)}
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xl ring-1 ring-inset ring-white/40 shadow-inner pointer-events-none" />

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

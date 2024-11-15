import { cn } from "@/lib/utils";
import { LayoutGrid, FileText, Bell, ChevronLeft, ChevronRight, Wallet, ListTodo } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const mainNavItems = [
    { icon: LayoutGrid, path: "/", label: "Dashboard" },
    { icon: FileText, path: "/events", label: "Events" },
    { icon: Wallet, path: "/calendar", label: "Calendar" },
    { icon: Bell, path: "/notifications", label: "Notification" },
  ];

  const otherNavItems = [
    { icon: ListTodo, path: "/tasks", label: "To-do list" },
    { icon: FileText, path: "/documents", label: "Documents" },
    { icon: Bell, path: "/agreements", label: "Agreements" },
  ];

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300",
        isCollapsed ? "w-[80px] bg-[#1A1F2C]" : "w-[280px] bg-white",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with Profile */}
        <div className="px-4 py-4 flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full bg-[#0A0F1D] flex-shrink-0",
            isCollapsed ? "mx-auto" : ""
          )} />
          {!isCollapsed && (
            <div className="flex-1">
              <div className="text-xs text-gray-400">PRODUCT DESIGNER</div>
              <div className="text-sm font-medium">Andrew Smith</div>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              isCollapsed 
                ? "bg-[#0A0F1D] text-gray-400 hover:text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-4 py-8">
          <div className="space-y-8">
            {/* MAIN section */}
            <div>
              <div className={cn(
                "text-xs font-medium mb-4",
                isCollapsed ? "text-gray-600 text-center" : "text-gray-400"
              )}>
                MAIN
              </div>
              <nav className="space-y-2">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
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

            {/* OTHER section */}
            <div>
              <div className={cn(
                "text-xs font-medium mb-4",
                isCollapsed ? "text-gray-600 text-center" : "text-gray-400"
              )}>
                OTHER
              </div>
              <nav className="space-y-2">
                {otherNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
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
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Add New Task Card */}
        {!isCollapsed && (
          <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-1">To-do List</h3>
            <p className="text-sm text-gray-500 mb-4">Creating or adding new tasks couldn't be easier</p>
            <button className="w-full bg-[#1A1F2C] text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
              <span className="text-lg">+</span> Add New Task
            </button>
          </div>
        )}

        {/* Footer with Add Button */}
        {isCollapsed && (
          <div className="p-4">
            <button className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-100">
              <span className="text-xl">+</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

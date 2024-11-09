import { LayoutDashboard, ListTodo, FolderKanban, Users, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Tasks", icon: ListTodo, path: "/tasks" },
    { name: "Projects", icon: FolderKanban, path: "/projects" },
    { name: "Clients", icon: Users, path: "/clients" },
    { name: "Documents", icon: FileText, path: "/documents" },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold text-gray-900">ProjectHub</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <item.icon className="sidebar-icon" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <Link to="/settings" className="nav-link">
          <Settings className="sidebar-icon" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

import { 
  LayoutGrid, 
  FileText, 
  Archive, 
  ListTodo, 
  Users, 
  CalendarDays,
  Users as UsersIcon,
  Building
} from "lucide-react";

export interface NavItem {
  icon: React.ElementType;
  path: string;
  label: string;
  badge?: number;
}

export function getSidebarNavItems(taskCount: number): NavItem[] {
  return [
    {
      icon: LayoutGrid,
      path: "/",
      label: "Dashboard"
    },
    {
      icon: FileText,
      path: "/events",
      label: "Upcoming Events"
    }, 
    {
      icon: CalendarDays,
      path: "/calendar",
      label: "Calendar"
    }, 
    {
      icon: ListTodo,
      path: "/tasks",
      label: "To-do list",
      badge: taskCount > 0 ? taskCount : undefined
    },
    {
      icon: Building,
      path: "/schedule/site-visit",
      label: "Schedule Site Visit"
    },
    {
      icon: UsersIcon,
      path: "/schedule/meeting",
      label: "Schedule Meeting"
    },
    {
      icon: FileText,
      path: "/documents",
      label: "Documents"
    },
    {
      icon: Users,
      path: "/contacts",
      label: "Contacts"
    },
    {
      icon: Archive,
      path: "/events/passed",
      label: "Past Events"
    }
  ];
}


import { Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Events from "@/pages/Events";
import PassedEvents from "@/pages/PassedEvents";
import Calendar from "@/pages/Calendar";
import Tasks from "@/pages/Tasks";
import NewEvent from "@/pages/NewEvent";
import ProfileSettings from "@/pages/ProfileSettings";
import Settings from "@/pages/Settings";
import Contacts from "@/pages/Contacts";
import Documents from "@/pages/Documents";
import EventDetails from "@/pages/EventDetails";
import EditEvent from "@/pages/EditEvent";
import TaskDetails from "@/pages/TaskDetails";
import Notifications from "@/pages/Notifications";
import ScheduleMeeting from "@/pages/ScheduleMeeting";
import ScheduleSiteVisit from "@/pages/ScheduleSiteVisit";
import NewTask from "@/pages/NewTask";
import MenuManagement from "@/pages/MenuManagement";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes that require authentication */}
      <Route element={
        <ProtectedRoute>
          <RootLayout>
            <Outlet />
          </RootLayout>
        </ProtectedRoute>
      }>
        <Route path="/" element={<Index />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/passed" element={<PassedEvents />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/tasks/new" element={<NewTask />} />
        <Route path="/events/new" element={<NewEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/schedule/meeting" element={<ScheduleMeeting />} />
        <Route path="/schedule/site-visit" element={<ScheduleSiteVisit />} />
        <Route path="/my-business" element={<MenuManagement />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

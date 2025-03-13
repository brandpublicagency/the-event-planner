
import { Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Events from "@/pages/Events";
import PassedEvents from "@/pages/PassedEvents";
import Calendar from "@/pages/Calendar";
import Tasks from "@/pages/Tasks";
import Projects from "@/pages/Projects";
import NewProject from "@/pages/NewProject";
import NewEvent from "@/pages/NewEvent";
import NewTask from "@/pages/NewTask";
import NewClient from "@/pages/NewClient";
import ProfileSettings from "@/pages/ProfileSettings";
import Contacts from "@/pages/Contacts";
import Clients from "@/pages/Clients";
import Documents from "@/pages/Documents";
import EventDetails from "@/pages/EventDetails";
import EditEvent from "@/pages/EditEvent";
import TaskDetails from "@/pages/TaskDetails";
import Notifications from "@/pages/Notifications";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RootLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/events" element={<Events />} />
        <Route path="/passed-events" element={<PassedEvents />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/events/new" element={<NewEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/tasks/new" element={<NewTask />} />
        <Route path="/clients/new" element={<NewClient />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

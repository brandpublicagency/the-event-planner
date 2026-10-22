
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PageLoader = () => (
  <div className="flex flex-1 items-center justify-center p-6" role="status" aria-label="Loading page">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);
import { RootLayout } from "@/layouts/RootLayout";
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Login = lazy(() => import("@/pages/Login"));
const Events = lazy(() => import("@/pages/Events"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const NewEvent = lazy(() => import("@/pages/NewEvent"));
const ProfileSettings = lazy(() => import("@/pages/ProfileSettings"));
const Settings = lazy(() => import("@/pages/Settings"));
const Contacts = lazy(() => import("@/pages/Contacts"));
const Documents = lazy(() => import("@/pages/Documents"));
const DocumentDetail = lazy(() => import("@/pages/DocumentDetail"));
const EventDetails = lazy(() => import("@/pages/EventDetails"));
const EditEvent = lazy(() => import("@/pages/EditEvent"));
const TaskDetails = lazy(() => import("@/pages/TaskDetails"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const ScheduleMeeting = lazy(() => import("@/pages/ScheduleMeeting"));
const ScheduleSiteVisit = lazy(() => import("@/pages/ScheduleSiteVisit"));
const NewTask = lazy(() => import("@/pages/NewTask"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes that require authentication */}
      <Route element={
        <ProtectedRoute>
          <RootLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </RootLayout>
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/passed" element={<Navigate to="/events?tab=passed" replace />} />
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
        <Route path="/documents/:id" element={<DocumentDetail />} />
        <Route path="/schedule/meeting" element={<ScheduleMeeting />} />
        <Route path="/schedule/site-visit" element={<ScheduleSiteVisit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </Suspense>
  );
};

import { Header } from "@/components/layout/Header";
import Dashboard2Greeting from "./Dashboard2Greeting";
import Dashboard2KPIStrip from "./Dashboard2KPIStrip";
import Dashboard2EventsSection from "./Dashboard2EventsSection";
import Dashboard2WeatherCard from "./Dashboard2WeatherCard";
import Dashboard2TasksSection from "./Dashboard2TasksSection";
import Dashboard2NotificationsDrawer from "./Dashboard2NotificationsDrawer";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardNotifications } from "@/components/dashboard/notifications/useDashboardNotifications";
import { Badge } from "@/components/ui/badge";

const Dashboard2Layout = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { unreadCount } = useDashboardNotifications();

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Dashboard 2">
        <div className="ml-auto mr-2 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge variant="notification" className="absolute -top-1 -right-1 h-4 min-w-[16px] text-[10px] px-1">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </Header>

      <div className="flex-1 overflow-auto px-4 pb-6">
        <Dashboard2Greeting />
        <Dashboard2KPIStrip />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Events — spans 2 cols on desktop */}
          <div className="lg:col-span-2">
            <Dashboard2EventsSection />
          </div>

          {/* Right sidebar: weather + tasks */}
          <div className="flex flex-col gap-4">
            <Dashboard2WeatherCard />
            <Dashboard2TasksSection />

            {/* Latest Updates trigger card */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="group rounded-lg border border-border bg-card p-4 text-left transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Latest Updates</span>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="notification" className="text-[10px] h-5 min-w-[20px]">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </button>
          </div>
        </div>
      </div>

      <Dashboard2NotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </div>
  );
};

export default Dashboard2Layout;

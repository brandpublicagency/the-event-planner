import { Header } from "@/components/layout/Header";
import Dashboard2Greeting from "./Dashboard2Greeting";
import Dashboard2KPIStrip from "./Dashboard2KPIStrip";
import Dashboard2EventsSection from "./Dashboard2EventsSection";
import Dashboard2WeatherCard from "./Dashboard2WeatherCard";
import Dashboard2TasksSection from "./Dashboard2TasksSection";
import Dashboard2MiniCalendar from "./Dashboard2MiniCalendar";
import Dashboard2NotificationsDrawer from "./Dashboard2NotificationsDrawer";
import Dashboard2CommandPalette from "./Dashboard2CommandPalette";
import { useState, useEffect } from "react";
import { Bell, Sun, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardNotifications } from "@/components/dashboard/notifications/useDashboardNotifications";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";

const Dashboard2Layout = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { unreadCount } = useDashboardNotifications();
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // CMD+K keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Dashboard 2">
        <div className="ml-auto mr-2 flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 text-xs text-muted-foreground px-3 mr-1"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
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
            <Dashboard2MiniCalendar />
            <Dashboard2WeatherCard />
            <Dashboard2TasksSection />

            {/* Latest Updates trigger card */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="group rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-foreground/30"
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
      <Dashboard2CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </div>
  );
};

export default Dashboard2Layout;

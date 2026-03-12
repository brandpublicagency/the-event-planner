import { Header } from "@/components/layout/Header";
import DashboardGreeting from "./DashboardGreeting";
import DashboardKPIStrip from "./DashboardKPIStrip";
import DashboardEventsSection from "./DashboardEventsSection";
import WeatherWidget from "./weather/WeatherWidget";
import DashboardTasksSection from "./DashboardTasksSection";
import DashboardMiniCalendar from "./DashboardMiniCalendar";
import DashboardTeamChat from "./DashboardTeamChat";
import DashboardNotificationsDrawer from "./DashboardNotificationsDrawer";
import DashboardCommandPalette from "./DashboardCommandPalette";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Sun, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardNotifications } from "@/components/dashboard/notifications/useDashboardNotifications";
import { useTheme } from "@/components/theme-provider";

const DashboardLayout = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { unreadCount } = useDashboardNotifications();
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
      <Header pageTitle="Dashboard">
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
            className="h-8 w-8 relative overflow-hidden"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            <motion.div
              key={isDark ? 'sun' : 'moon'}
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.div>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </Header>

      <div className="flex-1 overflow-auto px-4 pb-6">
        <WeatherWidget forcedVisible />
        <DashboardGreeting />
        <DashboardKPIStrip />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <DashboardEventsSection />
            <DashboardTeamChat className="h-[300px]" />
          </div>

          <div className="flex flex-col gap-4">
            <DashboardMiniCalendar />
            <DashboardTasksSection />
          </div>
        </div>
      </div>

      <DashboardNotificationsDrawer
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
      <DashboardCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </div>
  );
};

export default DashboardLayout;

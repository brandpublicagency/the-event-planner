
import { useState } from "react";
import UpcomingEventsSection from "./UpcomingEventsSection";
import DashboardTasksSection from "./DashboardTasksSection";
import DashboardNotificationsSection from "./DashboardNotificationsSection";

const DashboardContent = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column - Upcoming Events */}
      <UpcomingEventsSection />

      {/* Right column - Tasks and Notifications Vertical Layout */}
      <div className="flex flex-col gap-6 h-full">
        {/* Upcoming Tasks */}
        <DashboardTasksSection 
          selectedTaskId={selectedTaskId} 
          onTaskSelect={setSelectedTaskId} 
        />
        
        {/* Latest Updates (Notifications) */}
        <DashboardNotificationsSection />
      </div>
    </div>
  );
};

export default DashboardContent;

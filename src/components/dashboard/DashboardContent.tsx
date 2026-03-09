
import { useState } from "react";
import UpcomingEventsSection from "./UpcomingEventsSection";
import DashboardTasksSection from "./DashboardTasksSection";
import DashboardNotificationsSection from "./DashboardNotificationsSection";

const DashboardContent = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Left column - Upcoming Events */}
      <div className="overflow-hidden">
        <UpcomingEventsSection />
      </div>

      {/* Right column - Tasks and Notifications Vertical Layout */}
      <div className="flex flex-col gap-6 h-full">
        {/* Upcoming Tasks */}
        <div className="overflow-hidden">
          <DashboardTasksSection 
            selectedTaskId={selectedTaskId} 
            onTaskSelect={setSelectedTaskId} 
          />
        </div>
        
        {/* Latest Updates (Notifications) */}
        <DashboardNotificationsSection />
      </div>
    </div>
  );
};

export default DashboardContent;

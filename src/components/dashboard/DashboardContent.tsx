
import { useState } from "react";
import UpcomingEventsSection from "./UpcomingEventsSection";
import DashboardTasksSection from "./DashboardTasksSection";
import DashboardNotificationsSection from "./DashboardNotificationsSection";

const DashboardContent = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Left column - Upcoming Events */}
      <div className="bg-slate-50 rounded-lg overflow-hidden shadow-sm">
        <UpcomingEventsSection />
      </div>

      {/* Right column - Tasks and Notifications Vertical Layout */}
      <div className="flex flex-col gap-6 h-full">
        {/* Upcoming Tasks */}
        <div className="bg-slate-50 rounded-lg overflow-hidden shadow-sm">
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

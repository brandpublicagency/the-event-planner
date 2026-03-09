
import { Header } from "@/components/layout/Header";
import DashboardMessage from "@/components/dashboard/DashboardMessage";
import DashboardContent from "./DashboardContent";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Dashboard" />
      
      <div className="px-4 pb-4">
        {/* Full width greeting message */}
        <div className="mb-2">
          <DashboardMessage />
        </div>
        
        <DashboardContent />
      </div>
    </div>
  );
};

export default DashboardLayout;

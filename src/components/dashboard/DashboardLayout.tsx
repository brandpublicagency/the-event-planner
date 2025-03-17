
import { Header } from "@/components/layout/Header";
import DashboardMessage from "@/components/dashboard/DashboardMessage";
import DashboardContent from "./DashboardContent";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Dashboard" />
      
      <div className="grid grid-cols-1 gap-1 p-6">
        {/* Full width greeting message */}
        <div className="col-span-full">
          <DashboardMessage />
        </div>
        
        <DashboardContent />
      </div>
    </div>
  );
};

export default DashboardLayout;
